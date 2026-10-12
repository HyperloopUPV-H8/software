# Protocol Module

This module handles encoding and decoding of packets for communication with hardware boards over TCP and UDP transports. It implements the ADJ protocol for telemetry data, commands, messages, and protection events.

## Architecture

The protocol module follows a layered architecture:

```
┌─────────────────────────────────────────┐
│         Transport Layer                 │
│    (tcp.rs, udp.rs)                     │
├─────────────────────────────────────────┤
│         Packet Layer                    │
│  (packet/data_order.rs,                 │
│   packet/message.rs,                    │
│   packet/protection.rs)                 │
├─────────────────────────────────────────┤
│         Wire Layer                      │
│    (wire.rs)                            │
└─────────────────────────────────────────┘
```

## Directory Structure

```
protocol/
├── index.rs          # Packet definition lookup table
├── error.rs          # Decode and encode error types
├── wire.rs           # Low-level byte ↔ value conversion
├── packet.rs         # Packet-level encoding/decoding module
│   ├── data_order.rs # Data (telemetry) & Order (command) packets
│   ├── message.rs    # Free-text log message packets (stub)
│   └── protection.rs # Protection trigger packets (stub)
├── tcp.rs            # TCP transport framing (stub)
└── udp.rs            # UDP transport framing
```

## Modules

### `index.rs` - Packet Definition Lookup

Provides a fast lookup table from packet IDs (`AdjId`) to their declarations (`PacketDef`). Built once from loaded ADJ configuration data (`PodData`), it owns cloned copies of packet definitions so it can be shared across async tasks via `Arc<Index>`.

**Key types:**
- `Index` - HashMap-based lookup from `AdjId` to `PacketDef`

### `error.rs` - Error Types

Defines errors that can occur during packet encoding and decoding.

**Key types:**
- `DecodeError` - Errors when converting bytes to packets
  - `UnknownId` - No packet declared with this ID
  - `UnexpectedEof` - Ran out of bytes during decode
  - `Io` - I/O error reading from stream (TCP only)
  - `InvalidEnumValue` - Enum index out of range
  - `UnterminatedString` - String field not null-terminated
  - `WrongKind` - Packet exists but isn't expected kind

- `EncodeError` - Errors when converting packets to bytes
  - `UnknownId` - No packet declared with this ID
  - `WrongFieldCount` - Missing or extra fields in order
  - `TypeMismatch` - Value doesn't match declared type
  - `OutOfRange` - Numeric value doesn't fit wire type
  - `WrongKind` - Packet exists but isn't expected kind

### `wire.rs` - Low-Level Byte Codec

Handles conversion between raw bytes and `Value` types for individual measurements, based on their declared `MeasurementKind`. All numeric types use little-endian encoding.

**Key functions:**
- `decode_value(bytes, kind)` - Decode a single value from bytes
- `encode_value(value, kind)` - Encode a single value to bytes
- `byte_width(kind)` - Get the wire width in bytes for a measurement kind

**Supported types:**
- **Numeric** (U8, U16, U32, U64, I8, I16, I32, I64, F32, F64) - ✓ Implemented
- **Enum** (single byte index) - ✓ Implemented
- **Boolean** - ⚠ Stub (wire width not yet confirmed with firmware)

### `packet/` - Packet-Level Encoding/Decoding

Contains per-packet-kind encoding and decoding logic, independent of transport.

#### `data_order.rs`

Handles two packet kinds:
- **Order packets** (commands sent to boards) - Encoded only, sent over TCP
- **Data packets** (periodic telemetry from boards) - Decoded only, received over UDP

**Key functions:**
- `encode(order, index)` - Encode an Order packet into bytes
- `decode(bytes, index)` - Decode a Data packet from bytes

#### `message.rs` ⚠ Stub

Decodes free-text log messages from boards over TCP. Not yet implemented.

#### `protection.rs` ⚠ Stub

Decodes protection trigger events from boards over TCP. Not yet implemented.

### `tcp.rs` - TCP Transport Framing ⚠ Partial

Handles the dedicated TCP connection to each board. A TCP connection carries:
- Protection events (board → backend)
- Free-text messages (board → backend)
- Order commands (backend → board)

**Key types:**
- `TcpFrame` - Enum of frames that can be received over TCP (Protection, Message)

**Key functions:**
- `decode_next(reader, index)` - ⚠ Stub - Decode the next frame from a TCP stream
- `encode_order(order, index)` - ✓ Implemented - Encode an order for sending

### `udp.rs` - UDP Transport Framing

Handles the shared UDP socket for periodic telemetry. UDP datagrams are complete, already-delimited buffers containing Data packets.

**Key functions:**
- `decode_datagram(bytes, index)` - ✓ Implemented - Decode a UDP datagram into a DataPacket

## Packet Types Summary

| Packet Type | Direction | Transport | Status |
|-------------|-----------|-----------|--------|
| Data (telemetry) | Board → Backend | UDP | ✓ Implemented |
| Order (command) | Backend → Board | TCP | ✓ Implemented |
| Message (log) | Board → Backend | TCP | ⚠ Stub |
| Protection (event) | Board → Backend | TCP | ⚠ Stub |

## Implementation Status

- ✅ **Data packets** - Full encode/decode with tests
- ✅ **Order packets** - Full encode/decode with tests
- ✅ **Wire-level numeric types** - All numeric kinds supported with tests
- ✅ **Wire-level enum types** - Full encode/decode with tests
- ⚠️ **Wire-level boolean types** - Stub (awaiting firmware confirmation)
- ⚠️ **Message packets** - Stub (decode not implemented)
- ⚠️ **Protection packets** - Stub (decode not implemented)
- ⚠️ **TCP framing** - Partial (decode_next not implemented)

## Testing

The module includes comprehensive unit tests for:
- Wire-level encoding/decoding for all numeric types
- Enum encoding/decoding with boundary checks
- Order packet encoding with field validation
- Data packet decoding with error handling
- Error propagation for unknown IDs, wrong kinds, and type mismatches

Run tests with:
```bash
cargo test -p core protocol
```
