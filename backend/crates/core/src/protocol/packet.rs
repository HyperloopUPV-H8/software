//! Encode/decode for one specific kind of packet, independent of which
//! transport carries it — that mapping lives in [`super::tcp`]/
//! [`super::udp`], which are thin wrappers around these.
//!
//! [`data_order`]'s `encode`/`decode` are generic over `Kind`
//! ([`crate::model::KindTag`]), so they work for both `Data` and `Order`
//! alike; the backend itself only ever exercises one direction per kind
//! (an order is only ever sent, data only ever received), but that's a
//! restriction `tcp`/`udp` apply, not something baked into the codec.
//!
//! [`message`]/[`protection`] are genuinely one-directional in
//! production — a board only ever sends these, never receives them —
//! but both also expose an `encode`, purely so tests can build
//! well-formed frames without hand-written byte arrays; see each
//! module's own doc comment.

pub mod data_order;
pub mod message;
pub mod protection;
