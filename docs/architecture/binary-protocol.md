# Binary Protocol Specification

This document defines the binary wire protocol used for communication between the vehicle and backend over TCP/UDP networks.

## Protocol Overview

**Transport Protocols**: TCP (reliable) and UDP (fast)  
**Byte Order**: Little-endian for all multi-byte fields  
**Character Encoding**: ASCII for string fields  
**Packet Format**: Fixed header + variable payload

## Network Configuration

### Port Assignments
From `adj/general_info.json`:
- **TCP_CLIENT**: 50401 (backend connects to vehicle)
- **TCP_SERVER**: 50500 (vehicle connects to backend)
- **UDP**: 8000 (bidirectional communication)
- **TFTP**: 69 (file transfers)
- **SNTP**: 123 (time synchronization)

### IP Addressing
- **Backend**: Configurable (default: 127.0.0.9)
- **Vehicle Boards**: Per-board IP addresses in ADJ configuration

## Base Packet Structure

All packets follow this structure:

```
Byte Offset:  0        2        4+
             |========|========|========|
             |   Packet ID     | Payload |
             |   (uint16_le)   |   ...   |
             |========|========|========|
```

**Field Descriptions**:
- `Packet ID` (2 bytes): Little-endian uint16 identifying packet type
- `Payload` (variable): Packet-specific binary data

## Data Packet Format

### Structure

Data packets contain measurement values as defined in ADJ specifications.

```
Byte Offset:  0        2        4        6        8+
             |========|========|========|========|========|
             |   Packet ID     |    Measurement Values     |
             |   (uint16_le)   |     (per ADJ spec)        |
             |========|========|========|========|========|
```

### Value Encoding

Values are encoded based on their ADJ-defined data types:

#### Numeric Types
- `uint8`: 1 byte unsigned integer
- `uint16`: 2 bytes unsigned integer (little-endian)  
- `uint32`: 4 bytes unsigned integer (little-endian)
- `uint64`: 8 bytes unsigned integer (little-endian)
- `int8`: 1 byte signed integer (two's complement)
- `int16`: 2 bytes signed integer (little-endian, two's complement)
- `int32`: 4 bytes signed integer (little-endian, two's complement)  
- `int64`: 8 bytes signed integer (little-endian, two's complement)
- `float32`: 4 bytes IEEE 754 single-precision (little-endian)
- `float64`: 8 bytes IEEE 754 double-precision (little-endian)

#### Boolean Type
- `bool`: 1 byte (0x00 = false, 0x01 = true, other values undefined)

#### Enum Type
- Encoded as underlying integer type (typically uint8)
- Values mapped to enum variants per ADJ measurement definition

### Example Data Packet

**ADJ Packet Definition**:
```json
{
    "id": 211,
    "name": "vcu_regulator_packet",
    "type": "data",
    "variables": ["valve_state", "reference_pressure", "actual_pressure"]
}
```

**ADJ Measurements**:
```json
[
    {
        "id": "valve_state",
        "type": "uint8",
        "enumValues": ["closed", "open", "error"]
    },
    {
        "id": "reference_pressure", 
        "type": "float32"
    },
    {
        "id": "actual_pressure",
        "type": "float32"  
    }
]
```

**Binary Representation**:
```
Byte:     0    1    2    3    4    5    6    7    8    9   10   11
Data:   0xD3 0x00 0x01 0x42 0x08 0x00 0x00 0x42 0x04 0x66 0x66
Field:  [Packet ID] [valve] [  reference_pressure  ] [ actual_pressure ]
Value:     211      1        8.5                        8.1
```

**Breakdown**:
- Bytes 0-1: Packet ID 211 (0x00D3 little-endian)
- Byte 2: valve_state = 1 ("open")
- Bytes 3-6: reference_pressure = 8.5 (IEEE 754 float32)
- Bytes 7-10: actual_pressure = 8.1 (IEEE 754 float32)

## Protection Packet Format

Protection packets notify of safety conditions and faults.

### Complete Structure

```
Byte Offset:  0        2        4        5        6        7+
             |========|========|========|========|========|========|
             |   Packet ID     |  type  |  kind  |  Name String    |
             |   (uint16_le)   |(uint8) |(uint8) |  (null-term)    |
             |========|========|========|========|========|========|
             |           Protection Data (variable)                 |
             |========|========|========|========|========|========|
             |counter |counter | second | minute | hour   | day    |
             |(uint16)|(uint16)|(uint8) |(uint8) |(uint8) |(uint8) |
             |========|========|========|========|========|========|
             | month  |       year      |
             |(uint8) |   (uint16_le)   |
             |========|========|========|
```

### Field Definitions

**Header Fields**:
- `Packet ID` (2 bytes): Protection packet identifier
- `type` (1 byte): Data type being monitored (see Protection Types)
- `kind` (1 byte): Protection condition type (see Protection Kinds)
- `Name` (variable): Null-terminated ASCII string identifying the protection

**Protection Types** (`type` field):
```
0x00: IntType (int32)      0x06: LongType (int64)
0x01: FloatType (float32)  0x07: Uint8Type (uint8)
0x02: DoubleType (float64) 0x08: Uint16Type (uint16)  
0x03: CharType (uint8)     0x09: Uint32Type (uint32)
0x04: BoolType (bool)      0x0A: Uint64Type (uint64)
0x05: ShortType (int16)    0x0B: Int8Type (int8)
```

**Protection Kinds** (`kind` field):
```
0x00: Below              - Value below threshold
0x01: Above              - Value above threshold  
0x02: OutOfBounds        - Value outside range
0x03: Equals             - Value equals condition
0x04: NotEquals          - Value not equals condition
0x05: ErrorHandler       - System error condition
0x06: TimeAccumulation   - Time-based fault
0x07: Warning            - General warning
```

**Protection Data**: Variable-length data specific to protection kind
**Timestamp**: RTC timestamp from vehicle (9 bytes total)

### Protection Data Formats

#### Below/Above Protection
```
Byte Offset:  0        4        8+
             |========|========|========|
             |  Current Value  | Threshold |
             |   (per type)    |(per type) |
             |========|========|========|
```

#### OutOfBounds Protection  
```
Byte Offset:  0        4        8        12+
             |========|========|========|========|
             |  Current Value  | Min Bound | Max Bound |
             |   (per type)    |(per type) |(per type) |
             |========|========|========|========|
```

#### Equals/NotEquals Protection
```
Byte Offset:  0        4+
             |========|========|
             |  Current Value  |
             |   (per type)    |
             |========|========|
```

### Example Protection Packet

**Scenario**: Brake pressure above safe limit

**Binary Representation**:
```
Byte:     0    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19   20   21   22   23   24
Data:   0x02 0x00 0x01 0x01 0x62 0x72 0x61 0x6B 0x65 0x5F 0x70 0x72 0x65 0x73 0x73 0x75 0x72 0x65 0x00 0x42 0xD2 0x00 0x00 0x42
Field:  [PktID] [typ][knd] [            "brake_pressure"             ] [  current  ] [threshold]
Value:     2     1    1                 "brake_pressure\0"                 105.0        100.0
```

**Breakdown**:
- Bytes 0-1: Packet ID 2 (protection packet)
- Byte 2: type = 1 (FloatType)  
- Byte 3: kind = 1 (Above)
- Bytes 4-18: "brake_pressure\0" (null-terminated)
- Bytes 19-22: Current value = 105.0 (float32)
- Bytes 23-26: Threshold = 100.0 (float32)
- (Timestamp bytes follow...)

## Order Packet Format

Order packets send commands from backend to vehicle.

### Add Order Structure
```
Byte Offset:  0        2        4        6+
             |========|========|========|========|
             |   Packet ID     | Count  | Order IDs... |
             |   (uint16_le)   |(uint16)|  (uint16s)   |
             |========|========|========|========|
```

### Remove Order Structure  
```
Byte Offset:  0        2        4        6+
             |========|========|========|========|
             |   Packet ID     | Count  | Order IDs... |
             |   (uint16_le)   |(uint16)|  (uint16s)   |
             |========|========|========|========|
```

**Field Descriptions**:
- `Packet ID`: Order packet identifier (from message_ids in general_info.json)
- `Count`: Number of order IDs following (little-endian uint16)
- `Order IDs`: Array of order packet IDs to add/remove (little-endian uint16s)

### Example Order Packet

**Add State Order** (message_id: 5):
```
Byte:     0    1    2    3    4    5    6    7
Data:   0x05 0x00 0x02 0x00 0x10 0x00 0x11 0x00  
Field:  [PktID] [Count] [Order1] [Order2]
Value:     5      2       16       17
```

Adds orders with IDs 16 and 17 to the enabled state orders list.

## State Space Packet Format

State space packets contain control system matrices.

### Structure
```
Byte Offset:  0        2        4        8+
             |========|========|========|========|
             |   Packet ID     |   State Matrix   |
             |   (uint16_le)   |   (8x15 floats)  |
             |========|========|========|========|
```

**Field Descriptions**:
- `Packet ID`: State space packet identifier (message_id: 7)
- `State Matrix`: 8x15 matrix of float32 values (480 bytes total)
  - Row-major order encoding
  - Each float32 is 4 bytes little-endian IEEE 754

### Matrix Encoding
```
Matrix[0][0]  Matrix[0][1]  ... Matrix[0][14]   (60 bytes)
Matrix[1][0]  Matrix[1][1]  ... Matrix[1][14]   (60 bytes)
...
Matrix[7][0]  Matrix[7][1]  ... Matrix[7][14]   (60 bytes)
```

Total payload size: 480 bytes + 2 bytes packet ID = 482 bytes

## TFTP File Transfer Protocol

### Protocol
Standard TFTP (RFC 1350) over UDP port 69

### Request Formats

**Read Request (RRQ)**:
```
Opcode | Filename | 0 | Mode | 0
   2   | string   |   | "octet" |
```

**Write Request (WRQ)**:
```  
Opcode | Filename | 0 | Mode | 0
   2   | string   |   | "octet" |
```

**Data Block**:
```
Opcode | Block# | Data
   3   |   2    | 0-512 bytes
```

**Acknowledgment**:
```
Opcode | Block#
   4   |   2
```

**Error**:
```
Opcode | ErrorCode | ErrMsg | 0
   5   |     2     | string |
```

### BLCU File Operations

**Firmware Upload**: Backend writes firmware file to vehicle
**Configuration Download**: Backend reads configuration from vehicle  
**Log File Download**: Backend retrieves log files from vehicle

## Error Handling

### Transport Layer Errors
- **TCP Connection Lost**: Automatic reconnection with exponential backoff
- **UDP Packet Loss**: Statistics tracking, no retransmission
- **Malformed Packets**: Packet discarded, connection maintained

### Protocol Errors
- **Invalid Packet ID**: Warning logged, packet skipped
- **Payload Size Mismatch**: Packet discarded, sync recovery attempted
- **Checksum Failure**: (Future enhancement) Packet retransmission requested

### TFTP Errors
- **File Not Found** (Error Code 1): Requested file doesn't exist
- **Access Violation** (Error Code 2): Permission denied
- **Disk Full** (Error Code 3): Storage space exhausted
- **Illegal Operation** (Error Code 4): Invalid TFTP operation

## Implementation Notes

### Endianness Handling
All multi-byte integers use little-endian byte order:
```go
binary.LittleEndian.Uint16(data)  // Read 16-bit value
binary.LittleEndian.Uint32(data)  // Read 32-bit value
```

### String Encoding
- ASCII encoding for all text fields
- Null-terminated strings where specified
- No multi-byte character support

### Packet Validation
- Minimum packet size: 2 bytes (packet ID only)
- Maximum packet size: 1500 bytes (Ethernet MTU limit)
- Payload length validation against ADJ specifications

### Performance Considerations
- **UDP Preferred**: For high-frequency data packets (>10 Hz)
- **TCP Required**: For order packets and file transfers
- **Buffer Sizes**: 64KB receive buffers recommended
- **Concurrent Connections**: Support for multiple vehicle boards

This binary protocol specification enables efficient, real-time communication between the vehicle systems and the backend control station.