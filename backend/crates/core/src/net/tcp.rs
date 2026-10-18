//! The TCP client: one connection per board, one task each.
//!
//! **Not written yet.** This file currently holds only the error type
//! [`super::Error`] aggregates, plus the contract below, so that the rest
//! of `net` compiles and whoever implements this module knows what the
//! shared part expects of it. See [`super`] and `net/README.md`.
//!
//! # What this module is
//!
//! The backend is the **client**: it connects out to each board's
//! `TCP_SERVER` port, and never listens. One connection per board, each
//! one its own task with its own framing buffer and its own reconnection
//! state. That connection carries protections and messages inbound, and
//! orders and the keep-alive outbound.
//!
//! # Entry point
//!
//! [`spawn`], taking [`Config`], an `Arc<Index>` and a
//! [`super::Reporter`], and returning [`Handles`] — the API is written
//! out below, with its reasoning on the items themselves. One call opens
//! **every** connection: one task per entry in [`Config::boards`], so the
//! per-board bookkeeping stays here and `station` only ever asks for
//! "write this to that board".
//!
//! # Contract
//!
//! - **Framing is this module's job.** TCP is a byte stream: a frame can
//!   arrive split across reads, and two frames can arrive glued together
//!   in one read — both are normal, and the second is the common case.
//!   So: accumulate into a per-connection buffer, run
//!   [`crate::protocol::tcp::decode_next`] against a `&mut Cursor` over
//!   it, and on success advance the buffer by `cursor.position()`. Never
//!   consume from the buffer unless a frame parsed in full, or the stream
//!   is permanently misaligned. A failed parse means "not enough bytes
//!   yet"; the one safeguard is that no frame can exceed 374 bytes
//!   (`2 + 4 + 48 + 320`), so a buffer that grows past that without
//!   yielding a frame is out of step rather than waiting, and the
//!   connection should be dropped and reopened.
//! - **One writer task per connection.** Orders, the keep-alive and the
//!   fault all share the socket, so a single task must own the write
//!   half, or two half-written frames can interleave on the wire. That
//!   task is what [`super::Reporter`]-side callers reach through the
//!   board's channel in `Handles`.
//! - **Be ready to be told to propagate the fault.** `station` is what
//!   decides (it is the one consuming the error channel and reading
//!   [`Error::is_fatal`]); this module is what can actually write, so it
//!   exposes `Handles::propagate_fault`, which puts **the order with id
//!   0** — the fault, same as the Go backend's `SendFault` — into every
//!   board's writer channel at once, bounded by `write_timeout` per
//!   write. It reports back which boards it could not reach instead of
//!   collapsing them into one opaque error, since a fault that only
//!   half-landed is exactly what the operator has to know. The same path
//!   covers the other case the Go backend had under `propagate_fault`: a
//!   *received* packet with id 0 is a board announcing a fault, and
//!   `station` answers it by calling this, so that logic does not have to
//!   exist twice.
//! - Reconnection with exponential backoff and unlimited retries, the
//!   OS-level keep-alive disabled (there is an application-level one),
//!   `linger = 0` so a dropped connection frees its fixed local port
//!   immediately instead of sitting in `TIME_WAIT`.
//! - Report through [`super::Reporter`] only: [`super::Event::Connected`]
//!   and [`super::Event::Disconnected`] per connection,
//!   [`super::Event::Received`] per frame, and [`Error`] on the error
//!   channel. Never stamp a timestamp by hand — [`super::Reporter::notify`]
//!   does it. Never touch disk, WebSocket or aggregation.
//! - **A decode failure is fatal**: see [`Error::is_fatal`]. Log it and
//!   report it on the error channel — and that is all this module does
//!   about it. Sending the pod to fault is not `net`'s call to make:
//!   whoever consumes the error channel reads [`Error::is_fatal`] and
//!   decides, which also keeps the "fault once" guard in one place
//!   instead of one per transport. The stream cannot be resynchronised
//!   mid-frame, though, so this module does close the connection and let
//!   the reconnection loop reopen it — reconnecting will not fix a
//!   mismatched ADJ, so expect the same frame to fail again.
//! - Everything else is decided here, locally: a failed connect or write
//!   is what the backoff is for, and only the report goes up.

use super::Reporter;
use crate::model::{AdjId, BoardId, OrderPacket};
use crate::protocol::{DecodeError, Index};
use std::net::SocketAddr;
use std::sync::Arc;
use std::time::Duration;

/// One board to keep a connection to.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct BoardLink {
    /// Whose connection this is. Every report about it names this board,
    /// which is the whole identity of a link.
    pub board: BoardId,
    /// Where to connect: the board's `ip` + its `ports["TCP_SERVER"]`.
    pub addr: SocketAddr,
    /// The fixed local port to bind the client side to (`TCP_CLIENT + i`
    /// in the Go backend). Being fixed is why `linger = 0` matters: a
    /// dropped connection must not leave this port in `TIME_WAIT`.
    pub local_port: u16,
}

/// How long to wait between reconnection attempts.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Backoff {
    /// The first wait after a connection fails or drops.
    pub initial: Duration,
    /// The ceiling the doubling stops at. Retries are unlimited: a board
    /// that is not up yet is the normal state before a test, not an
    /// error to give up on.
    pub max: Duration,
}

/// How to run the TCP client.
///
/// Everything here is resolved by `station` before `net` is reached: this
/// module reads no config file, and it does not read the ADJ to find its
/// peers either. That is also what lets a test point it at a fake peer.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Config {
    /// One entry per board to connect to, already filtered by what the
    /// config file lists: a board the ADJ declares but the config does
    /// not name gets no client at all.
    pub boards: Vec<BoardLink>,
    /// Bound on each connection attempt.
    pub connect_timeout: Duration,
    /// What to wait between attempts.
    pub backoff: Backoff,
    /// Period of the application-level keep-alive this module sends on
    /// its own. The OS-level keep-alive is
    /// disabled precisely because this one exists.
    pub keep_alive: Duration,
    /// Bound on each write, so that a peer that stops reading cannot park
    /// a writer task for good (1 s in the Go backend).
    pub write_timeout: Duration,
}

/// Opens a connection to every board in `config.boards`.
///
/// One call, one task per board: the per-connection bookkeeping stays in
/// this module, and `station` only ever asks for "write this to that
/// board" through the [`Handles`] that come back.
///
/// `adj` is the only part of the ADJ this module needs: it decodes
/// inbound frames and encodes outbound orders against it. `station` owns
/// it and hands out clones; it is read-only here, and a reload of the ADJ
/// is a new [`Index`] with new tasks, never a mutation of this one.
///
/// Connecting is *not* done before spawning, unlike [`super::udp`]: a
/// board that is not up yet is normal, so a failed attempt is a report
/// and a retry, never a startup failure.
pub fn spawn(config: Config, adj: Arc<Index>, reporter: Reporter) -> Handles {
    let _ = (config, adj, reporter);
    todo!("the TCP client is not written yet: see this module's contract")
}

/// The writing side of every connection [`spawn`] opened.
///
/// The representation is left to the implementation — a writer channel
/// per board and the task handles — so that this file states the API and
/// nothing else.
#[derive(Debug)]
pub struct Handles {}

impl Handles {
    /// The handle for one board, or `None` if the config did not list it.
    #[must_use]
    pub fn board(&self, board: BoardId) -> Option<&BoardHandle> {
        let _ = board;
        todo!("the TCP client is not written yet: see this module's contract")
    }

    /// Hands an order to the board it belongs to, resolved by its id
    /// through the [`Index`].
    ///
    /// Returns once the order is queued on that board's writer, not once
    /// it is on the wire — the write itself is bounded by
    /// [`Config::write_timeout`] and reported through [`Error::Write`].
    ///
    /// # Errors
    ///
    /// See [`SendError`]: an id no ADJ declares, a board with no client,
    /// or a connection task that is gone.
    pub async fn send(&self, order: OrderPacket) -> Result<(), SendError> {
        let _ = order;
        todo!("the TCP client is not written yet: see this module's contract")
    }

    /// Sends the fault — the order with id 0 — to every board at once.
    ///
    /// This module does not decide to fault the pod; `station` does, by
    /// reading [`Error::is_fatal`] off the error channel. This is only
    /// the one place that can actually write it, so it is where the
    /// fan-out lives. A *received* packet with id 0 is a board asking for
    /// the same thing, and `station` answers it by calling this, so that
    /// logic does not exist twice.
    ///
    /// # Errors
    ///
    /// [`Unreachable`], naming the boards the fault did not reach rather
    /// than collapsing them into one opaque failure: a fault that only
    /// half landed is exactly what the operator has to be told.
    pub async fn propagate_fault(&self) -> Result<(), Unreachable> {
        todo!("the TCP client is not written yet: see this module's contract")
    }

    /// Closes every connection and waits for its task to finish.
    pub async fn shutdown(self) {
        todo!("the TCP client is not written yet: see this module's contract")
    }
}

/// The writing side of one board's connection.
///
/// The representation is left to the implementation, same as
/// [`Handles`].
#[derive(Debug)]
pub struct BoardHandle {}

impl BoardHandle {
    /// Hands an order to this board's writer, without consulting the
    /// order's id — [`Handles::send`] is what routes.
    ///
    /// # Errors
    ///
    /// [`SendError::Gone`] if this connection's task is no longer there.
    pub async fn send(&self, order: OrderPacket) -> Result<(), SendError> {
        let _ = order;
        todo!("the TCP client is not written yet: see this module's contract")
    }
}

/// Why an order could not be handed to a writer.
///
/// Returned to the caller, not reported through [`super::Reporter`]: it
/// says something about the order that was asked for, not about the state
/// of a connection. [`Error`] is the one that travels on the error
/// channel.
#[derive(Debug, Clone, Copy, PartialEq, Eq, thiserror::Error)]
pub enum SendError {
    /// No order with this id is declared in the loaded ADJ.
    #[error("no order is declared with id {0:?}")]
    UnknownId(AdjId),
    /// The order resolves to a board the config did not list, so no
    /// client was ever opened for it.
    #[error("board {0:?} has no TCP client: the config does not list it")]
    NoClient(BoardId),
    /// The board's connection task is no longer running.
    #[error("board {0:?}: its connection task is gone")]
    Gone(BoardId),
}

/// The boards a fault broadcast did not reach.
///
/// Never empty: a broadcast that reached everybody returns `Ok`.
#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
#[error("the fault did not reach these boards: {0:?}")]
pub struct Unreachable(pub Vec<BoardId>);

/// Something that went wrong on a board's TCP connection.
///
/// Every variant names its board, which is the whole identity of a link:
/// one connection per board.
#[derive(Debug, thiserror::Error)]
pub enum Error {
    /// The connection could not be opened.
    #[error("board {board:?}: could not connect")]
    Connect {
        /// The board that was being connected to.
        board: BoardId,
        /// The underlying I/O failure.
        #[source]
        source: std::io::Error,
    },

    /// A frame could not be decoded, which means the loaded ADJ does not
    /// describe what the board is sending. Fatal: see
    /// [`Error::is_fatal`].
    #[error("board {board:?}: could not decode a frame")]
    Decode {
        /// The board whose frame failed.
        board: BoardId,
        /// What [`crate::protocol`] said about it.
        #[source]
        source: DecodeError,
    },

    /// An order or a keep-alive could not be written.
    #[error("board {board:?}: could not write")]
    Write {
        /// The board that was being written to.
        board: BoardId,
        /// The underlying I/O failure.
        #[source]
        source: std::io::Error,
    },
}

impl Error {
    /// Whether this error means the pod has to be sent to fault.
    ///
    /// "Fatal" is about the **pod**, not about this process: the backend
    /// stays up — still reading its other connections, still serving the
    /// frontend, still recording — so that whoever is operating the pod
    /// can see what happened. Nothing here ever calls
    /// `std::process::exit`.
    ///
    /// Only [`Error::Decode`] qualifies, and this is the one place where
    /// the behaviour deliberately departs from the Go backend. Go treated
    /// an undecodable frame as a connection that had fallen out of step,
    /// and reconnecting was the remedy. But nothing corrupts a frame in
    /// flight — TCP checksums and retransmits — so a frame that will not
    /// decode means the loaded ADJ does not match what the firmware is
    /// sending, and reopening the connection cannot fix that. The stream
    /// still cannot be resynchronised mid-frame, so the connection is
    /// closed and reopened anyway; what changes is that the pod is also
    /// sent to fault instead of carrying on as if a retry would help.
    ///
    /// [`Error::Connect`] and [`Error::Write`] are not fatal: a board
    /// that is not up yet, or a write that failed on a connection that
    /// just dropped, is exactly what the reconnection loop with its
    /// backoff is for. Losing a board for good is reported through
    /// [`super::Event::Disconnected`], not through this.
    pub fn is_fatal(&self) -> bool {
        match self {
            Error::Decode { .. } => true,
            Error::Connect { .. } | Error::Write { .. } => false,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn io_error() -> std::io::Error {
        std::io::Error::from(std::io::ErrorKind::ConnectionRefused)
    }

    #[test]
    fn a_frame_that_will_not_decode_faults_the_pod() {
        let error = Error::Decode {
            board: BoardId(3),
            source: DecodeError::UnknownId(crate::model::AdjId(9999)),
        };

        // Not a desynchronised stream to retry: the ADJ does not match
        // the firmware, and reconnecting cannot fix that.
        assert!(error.is_fatal());
    }

    #[test]
    fn a_board_that_is_not_up_yet_does_not_fault_the_pod() {
        let connect = Error::Connect {
            board: BoardId(3),
            source: io_error(),
        };
        let write = Error::Write {
            board: BoardId(3),
            source: io_error(),
        };

        // That is what the reconnection backoff is for.
        assert!(!connect.is_fatal());
        assert!(!write.is_fatal());
    }

    #[test]
    fn an_error_says_which_board_it_was() {
        let error = Error::Write {
            board: BoardId(3),
            source: io_error(),
        };

        // The identity survives being formatted, which is what reaches
        // the operator.
        assert!(error.to_string().contains("BoardId(3)"));
    }
}
