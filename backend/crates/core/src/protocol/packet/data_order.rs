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