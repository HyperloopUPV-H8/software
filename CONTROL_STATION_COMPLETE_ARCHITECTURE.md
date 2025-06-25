# Control Station Complete Architecture

## Table of Contents
1. [System Overview](#system-overview)
2. [Core Components](#core-components)
3. [Data Flow: Board to Frontend](#data-flow-board-to-frontend)
4. [Command Flow: Frontend to Board](#command-flow-frontend-to-board)
5. [BLCU/TFTP Operations](#blcutftp-operations)
6. [Network Architecture](#network-architecture)
7. [Known Issues and Recommendations](#known-issues-and-recommendations)
8. [Troubleshooting Guide](#troubleshooting-guide)

## System Overview

The Hyperloop UPV Control Station is a real-time monitoring and control system that bridges the gap between the pod's embedded systems and human operators. It consists of:

- **Backend (Go)**: High-performance server handling network communication, packet processing, and state management
- **Frontend (React/TypeScript)**: Real-time web interfaces for monitoring and control
- **ADJ System**: JSON-based configuration defining packet structures, board specifications, and communication protocols

### Key Design Principles
- **Real-time Performance**: Sub-10ms fault detection to emergency stop
- **Modular Architecture**: Board-agnostic design using ADJ specifications
- **Type Safety**: Strongly typed packet definitions (backend), working towards frontend type safety
- **Fault Tolerance**: Automatic reconnection, graceful degradation
- **Scalability**: Concurrent packet processing, efficient memory usage

## Core Components

### Backend Components

```
backend/
├── cmd/main.go              # Entry point, initialization
├── internal/
│   ├── adj/                 # ADJ parser and validator
│   ├── pod_data/           # Packet structure definitions
│   └── vehicle/            # Vehicle state management
└── pkg/
    ├── transport/          # Network layer (TCP/UDP/TFTP)
    ├── presentation/       # Packet encoding/decoding
    ├── broker/            # Message distribution
    ├── websocket/         # Frontend communication
    └── boards/            # Board-specific logic (BLCU)
```

### Frontend Components

```
control-station/
├── src/
│   ├── services/          # WebSocket handlers
│   ├── components/        # UI components
│   └── state.ts          # State management
common-front/
└── lib/
    ├── wsHandler/        # WebSocket abstraction
    ├── models/           # Type definitions
    └── adapters/         # Data transformers
```

### ADJ Structure

```
adj/
├── general_info.json     # Ports, addresses, units
├── boards.json          # Board registry
└── boards/
    └── [BOARD_NAME]/
        ├── [BOARD_NAME].json      # Board config
        ├── measurements.json      # Data definitions
        ├── packets.json          # Board→Backend
        └── orders.json           # Backend→Board
```

## Data Flow: Board to Frontend

### 1. Binary Packet Transmission

Boards send binary packets with this structure:

```
┌─────────────┬─────────────────────────┐
│ Header (2B) │ Payload (variable)      │
├─────────────┼─────────────────────────┤
│ Packet ID   │ Data fields per ADJ     │
│ (uint16 LE) │ specification           │
└─────────────┴─────────────────────────┘
```

**Example**: Temperature sensor packet
```
64 00        // Packet ID: 100 (little-endian)
01           // sensor_id: 1 (uint8)
CD CC 8C 41  // temperature: 17.6°C (float32 LE)
10 27 00 00  // timestamp: 10000ms (uint32 LE)
```

### 2. Network Reception

The backend receives packets through multiple channels:

- **TCP Server** (port 50500): Boards connect to backend
- **TCP Client** (port 50401): Backend connects to boards
- **UDP Sniffer** (port 50400): High-frequency sensor data
- **TFTP** (port 69): Firmware transfers (BLCU only)

```go
// Simplified reception flow
func (t *Transport) HandleClient(config ClientConfig, boardAddr string) {
    conn, err := net.Dial("tcp", boardAddr)
    for {
        packet := t.readPacket(conn)
        t.routePacket(packet)
    }
}
```

### 3. Packet Decoding

The presentation layer decodes packets based on ADJ definitions:

```go
// Decoding process
id := binary.LittleEndian.Uint16(data[0:2])
decoder := t.decoders[id]
packet := decoder.Decode(data[2:])

// Apply unit conversions
for field, value := range packet.Fields {
    measurement := adj.GetMeasurement(field)
    value = applyConversion(value, measurement.PodUnits, measurement.DisplayUnits)
}
```

### 4. State Management & Distribution

The vehicle layer processes packets and updates system state:

```go
// Vehicle processing
func (v *Vehicle) ProcessPacket(packet Packet) {
    // Update internal state
    v.state.Update(packet)
    
    // Check safety conditions
    v.checkProtections(packet)
    
    // Distribute via broker
    v.broker.Publish("data/update", packet)
}
```

### 5. WebSocket Transmission

The broker converts packets to JSON and sends to connected clients:

```json
{
    "topic": "data/update",
    "payload": {
        "board_id": 4,
        "packet_id": 320,
        "packet_name": "lcu_coil_current",
        "timestamp": "2024-01-15T10:30:45.123Z",
        "measurements": {
            "lcu_coil_current_1": {
                "value": 2.5,
                "type": "float32",
                "units": "A",
                "enabled": true
            }
        }
    }
}
```

### 6. Frontend Processing

The React frontend receives and displays data:

```typescript
// WebSocket handler
wsHandler.subscribe("data/update", {
    id: "unique-id",
    cb: (data: PacketUpdate) => {
        // Update UI components
        updateMeasurement(data.measurements);
        updateCharts(data);
    }
});
```

## Command Flow: Frontend to Board

### 1. Order Creation

Frontend creates structured order objects:

```typescript
const order: Order = {
    id: 9995,  // From ADJ orders.json
    fields: {
        "ldu_id": { 
            value: 1, 
            isEnabled: true, 
            type: "uint8" 
        },
        "lcu_desired_current": { 
            value: 2.5, 
            isEnabled: true, 
            type: "float32" 
        }
    }
};
```

### 2. WebSocket Transmission

```typescript
wsHandler.post("order/send", order);
```

Sends JSON message:
```json
{
    "topic": "order/send",
    "payload": {
        "id": 9995,
        "fields": {
            "ldu_id": { "value": 1, "type": "uint8" },
            "lcu_desired_current": { "value": 2.5, "type": "float32" }
        }
    }
}
```

### 3. Backend Processing

```go
// Order processing pipeline
func (b *Broker) HandleOrder(order Order) {
    // 1. Validate order exists in ADJ
    boardName := b.getTargetBoard(order.ID)
    if !b.adj.ValidateOrder(boardName, order.ID) {
        return error("Invalid order ID")
    }
    
    // 2. Create packet structure
    packet := b.createPacket(order)
    
    // 3. Encode to binary
    data := b.encoder.Encode(packet)
    
    // 4. Send to board
    b.transport.SendTo(boardName, data)
}
```

### 4. Binary Encoding

The encoder converts the order to binary format:

```
Order: { id: 9995, ldu_id: 1, current: 2.5 }

Binary output:
0B 27        // ID: 9995 (0x270B little-endian)
01           // ldu_id: 1
00 00 20 40  // current: 2.5 (float32 LE)
```

### 5. Network Transmission

The transport layer sends the binary data to the target board via TCP.

## BLCU/TFTP Operations

The BLCU (BootLoader Control Unit) handles firmware updates using TFTP protocol.

### Upload Flow (Frontend → Board)

1. **Frontend initiates upload**:
```typescript
wsHandler.exchange("blcu/upload", {
    board: "LCU",
    filename: "firmware.bin",
    data: base64Data
});
```

2. **Backend sends order to BLCU**:
```go
// Send upload order (ID: 700)
ping := createPacket(BlcuUploadOrderId, targetBoard)
transport.Send(ping)
```

3. **Wait for ACK**:
```go
<-blcu.ackChan  // Blocks until ACK received
```

4. **TFTP Transfer**:
```go
client := tftp.NewClient(blcu.ip)
client.WriteFile(filename, tftp.BinaryMode, data)
```

5. **Progress updates via WebSocket**:
```json
{
    "topic": "blcu/register",
    "payload": {
        "operation": "upload",
        "progress": 0.65,
        "bytes_transferred": 340000,
        "total_bytes": 524288
    }
}
```

### Download Flow (Board → Frontend)

Similar process but uses:
- Order ID: 701
- `client.ReadFile()` for TFTP
- Returns file data to frontend

### TFTP Configuration

```go
type TFTPConfig struct {
    BlockSize:      131072,  // 128KB blocks
    Retries:        3,
    TimeoutMs:      5000,
    BackoffFactor:  2,
    EnableProgress: true
}
```

## Network Architecture

### IP Addressing Scheme

- **Backend**: 192.168.0.9
- **Boards**: 192.168.1.x (defined in ADJ)
- **BLCU**: Typically 192.168.1.254

### Port Assignments

| Service | Port | Protocol | Direction | Purpose |
|---------|------|----------|-----------|---------|
| TCP Server | 50500 | TCP | Board→Backend | Board connections |
| TCP Client | 50401 | TCP | Backend→Board | Backend initiates |
| UDP | 50400 | UDP | Bidirectional | High-freq data |
| TFTP | 69 | UDP | Bidirectional | Firmware transfer |
| WebSocket | 8080 | TCP/HTTP | Frontend→Backend | UI communication |
| SNTP | 123 | UDP | Board→Backend | Time sync (optional) |

### Connection Management

The backend maintains persistent TCP connections with automatic reconnection:

```go
// Exponential backoff for reconnection
backoff := 100ms
for {
    conn, err := net.Dial("tcp", boardAddr)
    if err != nil {
        time.Sleep(backoff)
        backoff = min(backoff * 1.5, 5s)
        continue
    }
    backoff = 100ms
    handleConnection(conn)
}
```

## Known Issues and Recommendations

### Critical Issues

1. **BLCU Hardcoded Configuration**
   - **Issue**: BLCU packet IDs (700, 701) hardcoded in backend
   - **Impact**: Cannot adapt to different BLCU versions
   - **Fix**: Move BLCU configuration to ADJ like other boards

2. **WebSocket Type Safety**
   - **Issue**: Frontend uses `any` type for payloads
   - **Impact**: Runtime errors, poor IDE support
   - **Fix**: Generate TypeScript types from ADJ specifications

3. **Monolithic main.go**
   - **Issue**: 800+ lines in single file
   - **Impact**: Hard to maintain and test
   - **Fix**: Refactor into logical modules

### Architecture Improvements Needed

1. **Error Handling Standardization**
   - Implement consistent error types
   - Add proper error wrapping
   - Improve error messages for operators

2. **Testing Coverage**
   - Current: ~30%
   - Target: 80%+
   - Focus on packet encoding/decoding edge cases

3. **Configuration Management**
   - Implement hot reload for non-critical settings
   - Add configuration validation
   - Support environment-specific configs

4. **Security Enhancements**
   - Add authentication for WebSocket connections
   - Implement TLS for external connections
   - Add audit logging for critical operations

### Performance Optimizations

1. **Connection Pooling**
   - Implement proper connection pool with health checks
   - Add connection limits and metrics
   - Support load balancing for multiple boards

2. **Message Batching**
   - Batch WebSocket updates for better performance
   - Implement configurable update rates
   - Add client-side throttling

## Troubleshooting Guide

### Common Issues

#### No Data from Board

1. **Check board is in config.toml**:
```toml
[vehicle]
boards = ["LCU", "HVSCU", "BMSL"]
```

2. **Verify network connectivity**:
```bash
ping 192.168.1.4  # Board IP
netstat -an | grep 504  # Check connections
```

3. **Check ADJ configuration**:
```bash
cat adj/boards.json | jq
cat adj/boards/LCU/LCU.json | jq
```

#### Order Not Working

1. **Verify order exists in ADJ**:
```bash
jq '.[] | select(.id == 9995)' adj/boards/LCU/orders.json
```

2. **Check WebSocket message format**:
- Open browser DevTools → Network → WS
- Verify message structure matches specification

3. **Check backend logs**:
```bash
tail -f trace.json | jq 'select(.msg | contains("order"))'
```

#### BLCU Upload Fails

1. **Check BLCU connection**:
- Verify BLCU IP in ADJ
- Test TFTP connectivity
- Check ACK timeout

2. **Verify file format**:
- Binary files only
- Check file size limits
- Verify checksums if implemented

#### WebSocket Disconnections

1. **Check browser console** for errors
2. **Verify backend is running**: Check PID file
3. **Network issues**: Check for firewall/proxy interference

### Debug Commands

```bash
# Monitor all packet flow
tail -f trace.json | jq

# Filter specific board
tail -f trace.json | jq 'select(.board_id == 4)'

# Watch WebSocket messages
# In browser: DevTools → Network → WS → Messages

# Check system resources
htop  # CPU/Memory usage
iftop  # Network usage

# Capture network traffic
sudo tcpdump -i any -w capture.pcap 'port 50400 or port 50500'
```

### Performance Monitoring

```bash
# Backend profiling (if enabled)
go tool pprof http://localhost:4040/debug/pprof/profile

# Check message rates
tail -f trace.json | jq -r .timestamp | uniq -c

# Monitor connection count
netstat -an | grep -c ESTABLISHED
```

---

*This document represents the complete architecture of the Hyperloop UPV Control Station as of 2025. For updates and corrections, please submit a pull request.*