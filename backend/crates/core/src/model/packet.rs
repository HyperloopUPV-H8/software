//! Wire packets.
//!
//! A [`Packet`] is a single message actually sent or received over the
//! wire, once decoded. This is the *instance* — as opposed to
//! [`super::Measurement`] and [`super::Protection`], which describe what a
//! packet or a protection *can* look like, or [`super::PacketDef`], which
//! describes a whole packet.

use super::{AdjId, Value};

/// A short timestamp carrying only the time of day: hour, minute, second
/// and a sub-second fraction, each one byte.
///
/// Used by [`ProtectionPacket`] and [`MessagePacket`]. Unlike a full
/// calendar timestamp, this only records *when today* something happened;
/// the date is assumed to be the day the packet was received.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct ShortTimestamp {
    /// The hour, 0–23.
    pub hour: u8,
    /// The minute, 0–59.
    pub minute: u8,
    /// The second, 0–59.
    pub second: u8,
    /// The sub-second fraction, as the raw byte on the wire.
    ///
    /// This byte was labeled `resv` ("reserved for alignment") at first,
    /// but it is in fact used for sub-second resolution. Its exact unit
    /// (e.g. milliseconds, or 1/256ths of a second) hasn't been confirmed
    /// yet, so it is kept as a raw `u8` here instead of converted to
    /// something like a `Duration` — convert it once the unit is settled.
    pub subsecond: u8,
}

/// A Data/Order packet: the decoded values of the measurements a board just
/// sent.
///
/// The wire protocol is positional: values are not individually tagged
/// with their measurement's id, just written back to back in the order
/// their [`super::Measurement`]s appear in this packet's
/// [`super::PacketKind::Data`] list. `values[i]` is the decoded value of
/// that list's `i`-th measurement — matching them up by position is
/// `protocol`'s job, this type just holds the result in that same order.

#[derive(Debug, Clone, PartialEq)]
pub struct DataOrderPacket<T>{
    pub id: AdjId,
    pub values: Vec<T>,
}

/// An order sent from the backend to a board.
///
/// Positional, the same way [`DataPacket::values`] is: see its docs.
pub type OrderPacket = DataOrderPacket<Value>;
pub type DataPacket = DataOrderPacket<Value>;

/// A protection packet: sent by a board when one of its declared
/// [`super::Protection`]s triggers.
///
/// `id` is the compound wire id: [`AdjId::measurement_id`] gives the
/// watched measurement, [`AdjId::protection_position`] which of that
/// measurement's protections triggered (see [`super::Protection::id`]).
/// Kept as a single field rather than storing both halves separately —
/// they're never independent of each other, so there's nothing a second
/// field would add beyond a second place for them to disagree.
#[derive(Debug, Clone, PartialEq)]
pub struct ProtectionPacket {
    /// The compound id this protection triggered under.
    pub id: AdjId,
    /// When it triggered.
    pub timestamp: ShortTimestamp,
    /// The value that triggered it, decoded with the same wire type as the
    /// watched measurement.
    pub value: Value,
}

/// How severe a message is (reusing `general_info.json`'s `message_ids`).
///
/// Unlike [`super::Severity`], which only distinguishes fault from warning
/// for protections, a message has two extra levels: `messages` and
/// `protections` are unrelated wire formats as of ADJv3, so this is a
/// separate type on purpose, not a reuse of [`super::Severity`].
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum MessageLevel {
    /// Stops the vehicle automatically.
    Fault,
    /// Flags something unexpected, without stopping the vehicle.
    Warning,
    /// Informational, no action implied.
    Info,
    /// An unrecoverable firmware error.
    Panic,
}

/// A free-text message sent by a board.
#[derive(Debug, Clone, PartialEq)]
pub struct MessagePacket {
    /// How severe the message is.
    pub level: MessageLevel,
    /// When it was sent.
    pub timestamp: ShortTimestamp,
    /// Where it came from, e.g. a source file path.
    pub origin: String,
    /// The message's contents.
    pub message: String,
}

/// Any packet actually sent or received over the wire, once decoded.
#[derive(Debug, Clone, PartialEq)]
pub enum Packet {
    /// A set of measurements sent by a board.
    Data(DataPacket),
    /// An order sent to a board.
    Order(OrderPacket),
    /// A protection that triggered.
    Protection(ProtectionPacket),
    /// A free-text message sent by a board.
    Message(MessagePacket),
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn two_timestamps_with_the_same_time_of_day_are_equal() {
        let a = ShortTimestamp {
            hour: 10,
            minute: 30,
            second: 0,
            subsecond: 0,
        };
        let b = ShortTimestamp {
            hour: 10,
            minute: 30,
            second: 0,
            subsecond: 0,
        };
        assert_eq!(a, b);
    }

    #[test]
    fn two_timestamps_that_only_differ_in_subsecond_are_not_equal() {
        let a = ShortTimestamp {
            hour: 10,
            minute: 30,
            second: 0,
            subsecond: 0,
        };
        let b = ShortTimestamp {
            hour: 10,
            minute: 30,
            second: 0,
            subsecond: 128,
        };
        assert_ne!(a, b);
    }

    #[test]
    fn a_protection_packets_id_splits_into_its_measurement_and_its_own_position() {
        // (1 << 13) | 3000 = 8192 | 3000 = 11192
        let packet = ProtectionPacket {
            id: AdjId((1u16 << 13) | 3000),
            timestamp: ShortTimestamp {
                hour: 12,
                minute: 0,
                second: 5,
                subsecond: 0,
            },
            value: Value::Number(53.2),
        };

        assert_eq!(packet.id.measurement_id(), AdjId(3000));
        assert_eq!(packet.id.protection_position(), 1);
    }

    #[test]
    fn message_level_has_four_distinct_values() {
        let levels = [
            MessageLevel::Fault,
            MessageLevel::Warning,
            MessageLevel::Info,
            MessageLevel::Panic,
        ];

        for (i, a) in levels.iter().enumerate() {
            for (j, b) in levels.iter().enumerate() {
                assert_eq!(a == b, i == j);
            }
        }
    }

    #[test]
    fn data_packet_values_are_positional_not_tagged_with_an_id() {
        // values[0] is whatever measurements[0] is in this packet's
        // PacketDef — there is no id stored alongside each value here.
        let packet = DataPacket {
            id: AdjId(1000),
            values: vec![Value::Number(53.2), Value::Bool(true)],
        };

        assert_eq!(packet.values[0], Value::Number(53.2));
        assert_eq!(packet.values[1], Value::Bool(true));
    }

    #[test]
    fn packet_wraps_each_kind_without_mixing_them_up() {
        let data = Packet::Data(DataPacket {
            id: AdjId(1000),
            values: vec![],
        });
        let order = Packet::Order(OrderPacket {
            id: AdjId(2000),
            values: vec![],
        });

        assert_ne!(data, order);
        match data {
            Packet::Data(_) => {}
            _ => unreachable!("this is a Packet::Data"),
        }
    }
}
