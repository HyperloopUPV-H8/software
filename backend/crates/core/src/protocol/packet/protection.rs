//! Decodes a `Protection` packet: a board reporting one of its declared
//! protections triggered. Only ever received, over TCP. Also provides
//! `encode`, purely so tests can build well-formed frames without
//! hand-written byte arrays — nothing in the real backend calls it, since
//! a protection never travels backend -> board.
//! Structure
//! ```
//! | 0-1   | 2     | 3     | 4     | 5     | 6-9   | 10-13 | 14-17 | 18-21 | 22-25 | 26-29 | 30-33 |
//! |-------|-------|-------|-------|-------|-------|-------|-------| 30-33 | 34-37 | 38-41 | 42-45 |
//! | id    | hora  | min   | seg   | subseg| resv | resv  | value | value  | value  | value  | value  |
//! | 34-37 | 38-41 | 42-45 |
//! |-------| 34-37 | 38-41 | 42-45 |
//! | value | value | value |
//! ```
//!

use crate::model::{AdjId, PacketKind, ProtectionPacket, ShortTimestamp};
use crate::protocol::{DecodeError, EncodeError, Index, wire};
use std::io::Read;

/// Decodes a protection frame's remaining bytes, given the frame's
/// already-read compound id (`tcp::decode_next`'s job), resolving the
/// watched measurement's wire type against `index`.
pub fn decode(
    mut reader: impl Read,
    compound_id: AdjId,
    index: &Index,
) -> Result<ProtectionPacket, DecodeError> {
    // Look up the packet definition for this compound id, and ensure it's a
    // protection packet. If not, the frame is malformed and we can't decode it.
    let packet_def = index
        .packet(compound_id)
        .ok_or(DecodeError::UnknownId(compound_id))?;

    let PacketKind::Protection(measurement) = &packet_def.kind else {
        return Err(DecodeError::WrongKind { id: compound_id });
    };

    // `hora`/`min`/`seg`/`subseg` (1 byte each), then 2 bytes of `resv`
    // padding that only exist to align `value` to an 8-byte offset — read
    // and discarded, there's nowhere to put them in `ProtectionPacket`.
    let mut header = [0u8; 6];
    reader.read_exact(&mut header)?;
    let timestamp = ShortTimestamp {
        hour: header[0],
        minute: header[1],
        second: header[2],
        subsecond: header[3],
    };

    // Read the `value` bytes, whose length is determined by the measurement's wire type, and decode them into a `Value`.
    let mut value_bytes = vec![0u8; wire::byte_width(&measurement.kind)];
    reader.read_exact(&mut value_bytes)?;
    let value = wire::decode_value(&value_bytes, &measurement.kind)?;

    Ok(ProtectionPacket {
        id: compound_id,
        timestamp,
        value,
    })
}

/// Encodes a [`ProtectionPacket`] back into the bytes [`decode`] expects.
///
/// Nothing in the real backend calls this — per the ADJ spec, protection
/// packets only ever travel board -> backend. This exists purely so
/// tests can build well-formed frames without hand-written byte arrays,
/// and to prove `decode` recovers exactly what was encoded.
///
/// Like `decode`, doesn't write the leading compound id (`packet.id`) —
/// `decode` doesn't read it either, since that's resolved one level up,
/// by whatever dispatches to this function in the first place.
pub fn encode(packet: &ProtectionPacket, index: &Index) -> Result<Vec<u8>, EncodeError> {
    let packet_def = index
        .packet(packet.id)
        .ok_or(EncodeError::UnknownId(packet.id))?;

    let PacketKind::Protection(measurement) = &packet_def.kind else {
        return Err(EncodeError::WrongKind { id: packet.id });
    };

    // `hora`/`min`/`seg`/`subseg` (1 byte each), then 2 bytes of `resv`
    let header = [
        packet.timestamp.hour,
        packet.timestamp.minute,
        packet.timestamp.second,
        packet.timestamp.subsecond,
        0, // resv — decode discards these, nothing to round-trip
        0, // resv
    ];
    let mut bytes = header.to_vec();

    bytes.extend(wire::encode_value(&packet.value, &measurement.kind)?);

    Ok(bytes)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::model::{
        AdjId, Board, BoardId, MacAddress, Measurement, MeasurementKind, NumericKind, PacketDef,
        PodData, Value,
    };
    use std::collections::HashMap;
    use std::io::Cursor;
    use std::net::IpAddr;

    fn sample_measurement(id: u16, kind: MeasurementKind) -> Measurement {
        Measurement {
            id: AdjId(id),
            alias: "mock_alias".to_string(),
            name: "Mock Measurement".to_string(),
            display_units: String::new(),
            kind,
            protections: vec![],
        }
    }

    fn index_with_protection(measurement: Measurement, position: u16) -> (Index, AdjId) {
        let compound_id = AdjId((position << 13) | measurement.id.0);
        let packet = PacketDef {
            id: compound_id,
            board: BoardId(1),
            name: "mock_protection".to_string(),
            kind: PacketKind::Protection(measurement),
        };
        let board = Board {
            id: BoardId(1),
            name: "MOCK".to_string(),
            ip: IpAddr::from([127, 0, 0, 1]),
            mac: MacAddress([0; 6]),
            packets: HashMap::from([(packet.id, packet)]),
        };
        let pod_data = PodData {
            boards: HashMap::from([(board.id, board)]),
        };
        (Index::new(&pod_data), compound_id)
    }

    #[test]
    fn decodes_a_numeric_protections_timestamp_and_value() {
        let measurement = sample_measurement(
            100,
            MeasurementKind::Numeric {
                wire_type: NumericKind::F32,
            },
        );
        let (index, compound_id) = index_with_protection(measurement, 1);

        let mut bytes = vec![12, 30, 5, 0, 0, 0]; // hora, min, seg, subseg, resv(2)
        bytes.extend(53.2f32.to_le_bytes());
        let reader = Cursor::new(bytes);

        let Ok(packet) = decode(reader, compound_id, &index) else {
            unreachable!("decoding a well-formed protection frame should succeed");
        };

        assert_eq!(packet.id.measurement_id(), AdjId(100));
        assert_eq!(packet.id.protection_position(), 1);
        assert_eq!(packet.timestamp.hour, 12);
        assert_eq!(packet.timestamp.minute, 30);
        assert_eq!(packet.timestamp.second, 5);
        assert_eq!(packet.value, Value::Number(f64::from(53.2f32)));
    }

    #[test]
    fn unknown_compound_id_is_an_error() {
        let measurement = sample_measurement(
            100,
            MeasurementKind::Numeric {
                wire_type: NumericKind::U8,
            },
        );
        let (index, _) = index_with_protection(measurement, 1);
        let unknown_id = AdjId((2 << 13) | 100);

        assert!(matches!(
            decode(Cursor::new(vec![]), unknown_id, &index),
            Err(DecodeError::UnknownId(id)) if id == unknown_id
        ));
    }

    #[test]
    fn a_non_protection_packet_at_that_id_is_the_wrong_kind() {
        let measurement = sample_measurement(
            200,
            MeasurementKind::Numeric {
                wire_type: NumericKind::U8,
            },
        );
        let compound_id = AdjId(200); // pos = 0: a normal, non-protection id
        let packet = PacketDef {
            id: compound_id,
            board: BoardId(1),
            name: "mock_data".to_string(),
            kind: PacketKind::Data(vec![measurement]),
        };
        let board = Board {
            id: BoardId(1),
            name: "MOCK".to_string(),
            ip: IpAddr::from([127, 0, 0, 1]),
            mac: MacAddress([0; 6]),
            packets: HashMap::from([(packet.id, packet)]),
        };
        let pod_data = PodData {
            boards: HashMap::from([(board.id, board)]),
        };
        let index = Index::new(&pod_data);

        assert!(matches!(
            decode(Cursor::new(vec![]), compound_id, &index),
            Err(DecodeError::WrongKind { id }) if id == compound_id
        ));
    }

    #[test]
    fn truncated_frame_is_unexpected_eof() {
        let measurement = sample_measurement(
            100,
            MeasurementKind::Numeric {
                wire_type: NumericKind::U32,
            },
        );
        let (index, compound_id) = index_with_protection(measurement, 1);

        // Header alone, no value bytes at all.
        let reader = Cursor::new(vec![0u8; 6]);

        assert!(matches!(
            decode(reader, compound_id, &index),
            Err(DecodeError::Io(_))
        ));
    }

    // --- ENCODE TESTS ---

    #[test]
    fn encode_then_decode_round_trips_timestamp_and_value() {
        let measurement = sample_measurement(
            100,
            MeasurementKind::Numeric {
                wire_type: NumericKind::F32,
            },
        );
        let (index, compound_id) = index_with_protection(measurement, 1);

        let original = ProtectionPacket {
            id: compound_id,
            timestamp: ShortTimestamp {
                hour: 12,
                minute: 30,
                second: 5,
                subsecond: 0,
            },
            value: Value::Number(f64::from(53.2f32)),
        };

        let Ok(bytes) = encode(&original, &index) else {
            unreachable!("encoding a well-formed protection packet should succeed");
        };
        let Ok(decoded) = decode(Cursor::new(bytes), compound_id, &index) else {
            unreachable!("decoding what we just encoded should succeed");
        };

        assert_eq!(decoded, original);
    }

    #[test]
    fn encode_zeroes_the_reserved_bytes() {
        let measurement = sample_measurement(
            100,
            MeasurementKind::Numeric {
                wire_type: NumericKind::U8,
            },
        );
        let (index, compound_id) = index_with_protection(measurement, 1);

        let packet = ProtectionPacket {
            id: compound_id,
            timestamp: ShortTimestamp {
                hour: 1,
                minute: 2,
                second: 3,
                subsecond: 4,
            },
            value: Value::Number(7.0),
        };

        let Ok(bytes) = encode(&packet, &index) else {
            unreachable!("encoding a well-formed protection packet should succeed");
        };

        assert_eq!(bytes[4], 0);
        assert_eq!(bytes[5], 0);
    }

    #[test]
    fn encode_fails_on_unknown_id() {
        let measurement = sample_measurement(
            100,
            MeasurementKind::Numeric {
                wire_type: NumericKind::U8,
            },
        );
        let (index, _) = index_with_protection(measurement, 1);
        let unknown_id = AdjId((2 << 13) | 100);

        let packet = ProtectionPacket {
            id: unknown_id,
            timestamp: ShortTimestamp {
                hour: 0,
                minute: 0,
                second: 0,
                subsecond: 0,
            },
            value: Value::Number(0.0),
        };

        let Err(err) = encode(&packet, &index) else {
            unreachable!("encoding an unknown id should fail");
        };
        assert_eq!(err, EncodeError::UnknownId(unknown_id));
    }

    #[test]
    fn encode_fails_on_wrong_kind() {
        let measurement = sample_measurement(
            200,
            MeasurementKind::Numeric {
                wire_type: NumericKind::U8,
            },
        );
        let compound_id = AdjId(200); // pos = 0: a normal, non-protection id
        let packet_def = PacketDef {
            id: compound_id,
            board: BoardId(1),
            name: "mock_data".to_string(),
            kind: PacketKind::Data(vec![measurement]),
        };
        let board = Board {
            id: BoardId(1),
            name: "MOCK".to_string(),
            ip: IpAddr::from([127, 0, 0, 1]),
            mac: MacAddress([0; 6]),
            packets: HashMap::from([(packet_def.id, packet_def)]),
        };
        let pod_data = PodData {
            boards: HashMap::from([(board.id, board)]),
        };
        let index = Index::new(&pod_data);

        let packet = ProtectionPacket {
            id: compound_id,
            timestamp: ShortTimestamp {
                hour: 0,
                minute: 0,
                second: 0,
                subsecond: 0,
            },
            value: Value::Number(0.0),
        };

        let Err(err) = encode(&packet, &index) else {
            unreachable!("encoding the wrong packet kind should fail");
        };
        assert_eq!(err, EncodeError::WrongKind { id: compound_id });
    }

    #[test]
    fn encode_bubbles_up_type_mismatch() {
        let measurement = sample_measurement(
            100,
            MeasurementKind::Numeric {
                wire_type: NumericKind::U8,
            },
        );
        let (index, compound_id) = index_with_protection(measurement, 1);

        let packet = ProtectionPacket {
            id: compound_id,
            timestamp: ShortTimestamp {
                hour: 0,
                minute: 0,
                second: 0,
                subsecond: 0,
            },
            value: Value::Bool(true),
        };

        let Err(err) = encode(&packet, &index) else {
            unreachable!("encoding a value of the wrong variant should fail");
        };
        assert_eq!(err, EncodeError::TypeMismatch);
    }

    #[test]
    fn encode_bubbles_up_out_of_range() {
        let measurement = sample_measurement(
            100,
            MeasurementKind::Numeric {
                wire_type: NumericKind::U8,
            },
        );
        let (index, compound_id) = index_with_protection(measurement, 1);

        let packet = ProtectionPacket {
            id: compound_id,
            timestamp: ShortTimestamp {
                hour: 0,
                minute: 0,
                second: 0,
                subsecond: 0,
            },
            value: Value::Number(300.0),
        };

        let Err(err) = encode(&packet, &index) else {
            unreachable!("encoding an out-of-range value should fail");
        };
        assert!(matches!(err, EncodeError::OutOfRange { .. }));
    }
}
