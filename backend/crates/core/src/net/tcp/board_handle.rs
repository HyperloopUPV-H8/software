use super::SendError;
use crate::model::{BoardId, OrderPacket};
use tokio::sync::mpsc;

/// Access to one board's TCP client, independent of its current socket.
///
/// Orders are queued through a bounded channel. The connection task owns
/// the receiving end and the socket; this handle owns neither of them.
/// Socket I/O is not implemented yet.
#[derive(Debug)]
pub struct BoardHandle {
    pub(super) board: BoardId,
    pub(super) orders: mpsc::Sender<OrderPacket>,
}

impl BoardHandle {
    /// The board this handle belongs to.
    #[must_use]
    pub fn board(&self) -> BoardId {
        self.board
    }

    /// Queues an order for this board, waiting if the channel is full.
    ///
    /// Returns once the order is queued, not once it is written to the socket
    /// or received by the board. This method does not validate the order
    /// against the ADJ or resolve its destination: callers select the board.
    /// Use [`super::Handles::send`] to resolve the destination by order ID.
    ///
    /// # Errors
    ///
    /// Returns [`SendError::Gone`] if the channel's receiver has been closed
    /// or dropped, including while this call was waiting for queue capacity.
    /// This indicates an unavailable consumer, not a TCP disconnection.
    pub async fn send(&self, order: OrderPacket) -> Result<(), SendError> {
        self.orders
            .send(order)
            .await
            .map_err(|_| SendError::Gone(self.board))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::model::{AdjId, Value};
    use std::future::{Future, poll_fn};
    use std::task::Poll;

    fn board_channel(capacity: usize) -> (BoardHandle, mpsc::Receiver<OrderPacket>) {
        let (orders, receiver) = mpsc::channel(capacity);
        (
            BoardHandle {
                board: BoardId(3),
                orders,
            },
            receiver,
        )
    }

    #[tokio::test]
    async fn queues_orders_unchanged_in_send_order() {
        let (handle, mut receiver) = board_channel(2);
        let first = OrderPacket::new(AdjId(600), vec![Value::Number(42.0)]);
        let second = OrderPacket::new(AdjId(601), vec![]);

        assert_eq!(handle.send(first.clone()).await, Ok(()));
        assert_eq!(handle.send(second.clone()).await, Ok(()));

        assert_eq!(receiver.try_recv(), Ok(first));
        assert_eq!(receiver.try_recv(), Ok(second));
        assert_eq!(receiver.try_recv(), Err(mpsc::error::TryRecvError::Empty));
    }

    #[tokio::test]
    async fn waits_for_capacity_without_dropping_orders() {
        let (handle, mut receiver) = board_channel(1);
        let first = OrderPacket::new(AdjId(600), vec![]);
        let second = OrderPacket::new(AdjId(601), vec![]);
        assert_eq!(handle.send(first.clone()).await, Ok(()));

        let blocked = handle.send(second.clone());
        tokio::pin!(blocked);

        // Poll explicitly so the test proves backpressure without timing sleeps.
        poll_fn(|cx| {
            assert!(blocked.as_mut().poll(cx).is_pending());
            Poll::Ready(())
        })
        .await;

        assert_eq!(receiver.try_recv(), Ok(first));
        assert_eq!(blocked.await, Ok(()));
        assert_eq!(receiver.try_recv(), Ok(second));
    }

    #[tokio::test]
    async fn reports_the_board_when_the_receiver_is_dropped() {
        let (handle, receiver) = board_channel(1);
        drop(receiver);

        let order = OrderPacket::new(AdjId(600), vec![]);
        assert_eq!(handle.send(order).await, Err(SendError::Gone(BoardId(3))));
    }

    #[tokio::test]
    async fn a_waiting_send_fails_when_the_receiver_closes() {
        let (handle, mut receiver) = board_channel(1);
        let first = OrderPacket::new(AdjId(600), vec![]);
        assert_eq!(handle.send(first.clone()).await, Ok(()));

        let blocked = handle.send(OrderPacket::new(AdjId(601), vec![]));
        tokio::pin!(blocked);
        poll_fn(|cx| {
            assert!(blocked.as_mut().poll(cx).is_pending());
            Poll::Ready(())
        })
        .await;

        receiver.close();
        assert_eq!(blocked.await, Err(SendError::Gone(BoardId(3))));
        assert_eq!(receiver.try_recv(), Ok(first));
        assert_eq!(
            receiver.try_recv(),
            Err(mpsc::error::TryRecvError::Disconnected)
        );
    }
}
