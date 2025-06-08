# System Architecture Overview

The Hyperloop H10 Control Station is a real-time monitoring and control system designed for managing pod operations during testing and competition runs.

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Pod Sensors   │◄──►│   Backend       │◄──►│   Frontend      │
│   & Boards      │    │   (Go Server)   │    │   (React Apps)  │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │                 │
                    │   Data Logger   │
                    │   & Storage     │
                    │                 │
                    └─────────────────┘
```

## Core Components

### 1. Backend (Go)
- **Location**: `backend/`
- **Purpose**: Real-time data processing and communication hub
- **Key Features**:
  - TCP/UDP packet processing
  - WebSocket server for frontend communication
  - TFTP server for firmware updates
  - Data logging and storage
  - Board abstraction and management

### 2. Frontend Applications (React/TypeScript)
- **Common Frontend**: `common-front/` - Shared component library
- **Control Station**: `control-station/` - Main operational interface
- **Ethernet View**: `ethernet-view/` - Network debugging and monitoring

### 3. Supporting Tools
- **Packet Sender**: `packet-sender/` - Testing and simulation tool
- **Updater**: `updater/` - System update management
- **Scripts**: `scripts/` - Development and deployment automation

## Data Flow

1. **Sensor Data Collection**
   - Pod sensors send data via Ethernet/TCP
   - Backend receives and parses packets according to ADJ specifications

2. **Real-time Processing**
   - Data validation and transformation
   - State management and safety checks
   - Message routing and broadcasting

3. **Frontend Display**
   - WebSocket communication for real-time updates
   - Interactive dashboards and controls
   - Data visualization and monitoring

4. **Data Persistence**
   - CSV logging for analysis
   - Configuration management
   - Historical data storage

## Technology Stack

### Backend
- **Language**: Go 1.21+
- **Networking**: TCP/UDP sockets, WebSocket (Gorilla)
- **Packet Capture**: libpcap for network monitoring
- **Concurrency**: Goroutines and channels for real-time processing

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit, Zustand
- **Styling**: SCSS Modules
- **Communication**: WebSocket, HTTP APIs

### Development Tools
- **Version Control**: Git with GitHub workflows
- **Package Management**: Go modules, npm
- **Build System**: Make, platform-specific scripts
- **Testing**: Go testing, frontend unit tests

## Security Considerations

- Network communication validation
- Input sanitization and validation
- Access control for critical operations
- Secure firmware update mechanisms

## Scalability Features

- Modular board management system
- Configurable ADJ specifications
- Plugin-based architecture for new sensors
- Horizontal scaling capabilities

## Communication Protocols

Comprehensive documentation for all communication layers:

- [**Protocols Overview**](./protocols.md) - High-level communication architecture
- [**Message Structures**](./message-structures.md) - Complete message format specifications  
- [**Binary Protocol**](./binary-protocol.md) - Vehicle ↔ Backend wire protocol
- [**WebSocket API**](./websocket-api.md) - Backend ↔ Frontend API specification

## Related Documentation

- [Backend Architecture](backend.md) - Detailed backend design
- [Frontend Architecture](frontend.md) - Frontend application structure
- [Development Setup](../development/DEVELOPMENT.md) - Getting started guide