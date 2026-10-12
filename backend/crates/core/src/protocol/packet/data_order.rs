use crate::model::{AdjId, DataPacket, PacketKind, Value, DataOrderPacket};
use crate::protocol::{wire, EncodeError, Index, DecodeError};


//! Encodes an `Order` packet: a command sent to a board. Only ever sent,
//! over TCP — the backend never receives one back.

/// Encodes `order` into the bytes to write to a board's connection,
/// resolving its field shapes against `index`.
pub fn encode(order: &DataOrderPacket<Value>, index: &Index) -> Result<Vec<u8>, EncodeError> {

    //Unwrap PacketDef for kind
    let packet_def = index
        .packet(order.id)
        .ok_or(EncodeError::UnknownId(order.id))?;// Question mark for error propagation and prevent crash

    //Check if packetdef is PacketKind::Order(measurement). Also returns the list of measurements
    let measurements = match &packet_def.kind{
        PacketKind::Order(measurements) => measurements,
        _ => return Err(EncodeError::WrongKind {id:order.id})
    };

    //Check if length of list of fields matches number of measurements.
    if order.values.len() != measurements.len(){
        return Err(EncodeError::WrongFieldCount {expected:measurements.len(),got:order.values.len()})
    }

    let mut bytes = Vec::new();

    bytes.extend_from_slice(&order.id.0.to_le_bytes());//Header prefix of byte stream to 16 bit little-endian

    //Encoding to bytes
    for (field,measurement) in order.values.iter().zip(measurements){ //For each measurement
        let field_bytes = wire::encode_value(field,&measurement.kind)?;// Encode field Value into bytes according to MeasurementKind
        bytes.extend(field_bytes);// Adds to byte stream
    }

    Ok(bytes) // Return bytes
}


//
//     "look up order.id in `index` to get its PacketDef (UnknownId if \
//          absent); match its `kind` for PacketKind::Order(measurements) \
//          (WrongKind if it's some other kind); error with WrongFieldCount \
//          if order.fields.len() doesn't match measurements.len(); encode \
//          the id then each field positionally via wire::encode_value"
//

//! Decodes a `Data` packet: a board's periodic telemetry. Only ever
//! received, over UDP — a board never receives one back.

/// Decodes a complete, already-delimited buffer into a [`DataPacket`],
/// resolving its field shapes against `index`.
pub fn decode(bytes: &[u8], index: &Index) -> Result<DataOrderPacket<Value>, DecodeError> {
    if bytes.len() < 2 {
        // If less than 2 bytes return error
        return Err(DecodeError::UnexpectedEof);
    }

    let id: [u8; 2] = bytes[0..2] // Recieve first two bytes
        .try_into() // Tries to make it into desired type
        .map_err(|_| DecodeError::UnexpectedEof)?; // If fails, return error

    let adj_id = AdjId(u16::from_le_bytes(id)); // Parse into u16 and make it AdjId type

    let packet_def = index.get(adj_id).ok_or(DecodeError::UnknownId(adj_id))?; // Get packet definition from index

    let measurements = match &packet_def.kind {
        // Get measurements from packet definition
        PacketKind::Data(measurements) => measurements, // If packet kind is data, return measurements
        _ => return Err(DecodeError::WrongKind { id: adj_id }), // If not, return Error
    };

    let mut values = Vec::with_capacity(measurements.len()); // Create vectir list of values same size as measurements

    let mut pointer = 2; // Pointer to after ID in bytes

    for measurement in measurements {
        let width = wire::byte_width(&measurement.kind);

        let next = pointer + width;

        if bytes.len() < next {
            // Check if there is enough bytes left
            return Err(DecodeError::UnexpectedEof);
        }

        let field = &bytes[pointer..next]; // Size of field (bytes between pointer and next position)
        let value = wire::decode_value(field, &measurement.kind)?; // Decode value from field size and measurement width
        values.push(value); //Add to list of values

        pointer = next; // Next position
    }

    Ok(DataPacket { id: adj_id, values }) // Return data packet
}

//
//     "read the leading 16-bit id; look up its PacketDef in `index` \
//          (UnknownId if absent); match its `kind` for \
//          PacketKind::Data(measurements) (WrongKind if it's some other \
//          kind); decode each measurement's value positionally via \
//          wire::decode_value, advancing through `bytes` using each \
//          measurement's own wire width"
//

#[cfg(test)]
mod tests {
    use super::*;
    use crate::model::{
        Board, BoardId, MacAddress, Measurement, MeasurementKind, NumericKind, PacketDef,
        PacketKind, PodData, Value,
    };
    use std::collections::HashMap;
    use std::net::IpAddr;

    fn sample_measurement(id: u16, kind: MeasurementKind) -> Measurement {
        Measurement {
            id: AdjId(id),
            alias: format!("field_{id}"),
            name: format!("Field {id}"),
            display_units: String::new(),
            kind,
            protections: vec![],
        }
    }

    fn sample_packet_def(id: AdjId, kind: PacketKind) -> PacketDef {
        PacketDef {
            id,
            board: BoardId(1),
            name: "TestPacket".into(),
            kind,
        }
    }

    fn make_test_index(defs: Vec<PacketDef>) -> Index {
        let packets: HashMap<AdjId, PacketDef> = defs.into_iter().map(|p| (p.id, p)).collect();
        let board = Board {
            id: BoardId(1),
            name: "TestBoard".to_string(),
            ip: IpAddr::from([127, 0, 0, 1]),
            mac: MacAddress([0; 6]),
            packets,
        };
        let pod_data = PodData {
            boards: HashMap::from([(board.id, board)]),
        };
        Index::new(&pod_data)
    }

    // --- ENCODE TESTS ---

    #[test]
    fn encode_success_little_endian_and_positional_fields() {
        let order_id = AdjId(1001);
        let packet_def = sample_packet_def(
            order_id,
            PacketKind::Order(vec![
                sample_measurement(1, MeasurementKind::Numeric { wire_type: NumericKind::U16 }),
                sample_measurement(2, MeasurementKind::Boolean),
            ]),
        );

        let index = make_test_index(vec![packet_def]);

        let packet = DataOrderPacket {
            id: order_id,
            values: vec![Value::Number(300.0), Value::Bool(true)],
        };

        let encoded = encode(&packet, &index).expect("encoding should succeed");

        // 1001 in little-endian u16: [0xE9, 0x03]
        // 300 in little-endian u16: [0x2C, 0x01]
        // true: [0x01]
        assert_eq!(encoded, vec![0xE9, 0x03, 0x2C, 0x01, 0x01]);
    }

    #[test]
    fn encode_fails_on_unknown_id() {
        let index = make_test_index(vec![]);
        let packet = DataOrderPacket {
            id: AdjId(9999),
            values: vec![],
        };

        let err = encode(&packet, &index).unwrap_err();
        assert_eq!(err, EncodeError::UnknownId(AdjId(9999)));
    }

    #[test]
    fn encode_fails_on_wrong_kind() {
        let data_id = AdjId(2001);
        let packet_def = sample_packet_def(data_id, PacketKind::Data(vec![]));

        let index = make_test_index(vec![packet_def]);
        let packet = DataOrderPacket {
            id: data_id,
            values: vec![],
        };

        let err = encode(&packet, &index).unwrap_err();
        assert_eq!(err, EncodeError::WrongKind { id: data_id });
    }

    #[test]
    fn encode_fails_on_wrong_field_count() {
        let order_id = AdjId(1002);
        let packet_def = sample_packet_def(
            order_id,
            PacketKind::Order(vec![
                sample_measurement(1, MeasurementKind::Numeric { wire_type: NumericKind::U8 }),
                sample_measurement(2, MeasurementKind::Numeric { wire_type: NumericKind::U8 }),
            ]),
        );

        let index = make_test_index(vec![packet_def]);
        let packet = DataOrderPacket {
            id: order_id,
            values: vec![Value::Number(10.0)],
        };

        let err = encode(&packet, &index).unwrap_err();
        assert_eq!(
            err,
            EncodeError::WrongFieldCount {
                expected: 2,
                got: 1,
            }
        );
    }

    // --- DECODE TESTS ---

    #[test]
    fn decode_success_little_endian_and_values() {
        let data_id = AdjId(3001);
        let packet_def = sample_packet_def(
            data_id,
            PacketKind::Data(vec![
                sample_measurement(1, MeasurementKind::Numeric { wire_type: NumericKind::U16 }),
                sample_measurement(2, MeasurementKind::Boolean),
            ]),
        );

        let index = make_test_index(vec![packet_def]);

        // 3001 in little-endian u16: [0xB9, 0x0B]
        // 500 in little-endian u16: [0xF4, 0x01]
        // false: [0x00]
        let raw_bytes = [0xB9, 0x0B, 0xF4, 0x01, 0x00];

        let decoded = decode(&raw_bytes, &index).expect("decoding should succeed");

        assert_eq!(decoded.id, data_id);
        assert_eq!(
            decoded.values,
            vec![Value::Number(500.0), Value::Bool(false)]
        );
    }

    #[test]
    fn decode_fails_when_buffer_is_shorter_than_header() {
        let index = make_test_index(vec![]);
        let err = decode(&[0x01], &index).unwrap_err();
        assert_eq!(err, DecodeError::UnexpectedEof);
    }

    #[test]
    fn decode_fails_on_unexpected_eof_in_payload() {
        let data_id = AdjId(3002);
        let packet_def = sample_packet_def(
            data_id,
            PacketKind::Data(vec![
                sample_measurement(1, MeasurementKind::Numeric { wire_type: NumericKind::U32 }),
            ]),
        );

        let index = make_test_index(vec![packet_def]);

        let raw_bytes = [0xBA, 0x0B, 0x01, 0x02];
        let err = decode(&raw_bytes, &index).unwrap_err();
        assert_eq!(err, DecodeError::UnexpectedEof);
    }

    #[test]
    fn decode_fails_on_unknown_id() {
        let index = make_test_index(vec![]);
        let raw_bytes = [0x88, 0x13];

        let err = decode(&raw_bytes, &index).unwrap_err();
        assert_eq!(err, DecodeError::UnknownId(AdjId(5000)));
    }

    #[test]
    fn decode_fails_on_wrong_kind() {
        let order_id = AdjId(4001);
        let packet_def = sample_packet_def(order_id, PacketKind::Order(vec![]));

        let index = make_test_index(vec![packet_def]);
        let raw_bytes = [0xA1, 0x0F];

        let err = decode(&raw_bytes, &index).unwrap_err();
        assert_eq!(err, DecodeError::WrongKind { id: order_id });
    }
}