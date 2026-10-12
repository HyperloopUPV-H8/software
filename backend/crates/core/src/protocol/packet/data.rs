//! Decodes a `Data` packet: a board's periodic telemetry. Only ever
//! received, over UDP — a board never receives one back.

use crate::model::{AdjId, DataPacket, PacketKind};
use crate::protocol::{DecodeError, Index, wire};

/// Decodes a complete, already-delimited buffer into a [`DataPacket`],
/// resolving its field shapes against `index`.
pub fn decode(bytes: &[u8], index: &Index) -> Result<DataPacket, DecodeError> {
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
