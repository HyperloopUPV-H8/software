# Packet Sender Documentation

A professional board simulator for the Hyperloop H10 project that recreates real board behavior for comprehensive backend testing.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [CLI Reference](#cli-reference)
- [Configuration](#configuration)
- [Board Simulation](#board-simulation)
- [Development Integration](#development-integration)
- [Troubleshooting](#troubleshooting)

## Overview

The Packet Sender is a comprehensive board simulation tool that accurately recreates the behavior of physical Hyperloop boards. It supports multiple protocol types, realistic data generation, and advanced features like protection simulation and state machine modeling.

### Key Capabilities

- **Multi-Protocol Support**: TCP and UDP connections with auto-reconnection
- **Complete Packet Types**: Data, Protection, State, and Order packets
- **Real Board Simulation**: Accurate recreation of board communication patterns
- **Professional CLI**: Comprehensive command-line interface with extensive options
- **Real-time Monitoring**: Live statistics and connection status tracking
- **Development Integration**: Seamless integration with existing development workflows

## Features

### Connection Management
- **Auto-reconnection** with exponential backoff
- **TCP and UDP** protocol support
- **Connection state tracking** and monitoring
- **Graceful error handling** and recovery
- **Configurable retry policies** and timeouts

### Packet Generation
- **Data Packets**: Realistic telemetry with sine-wave patterns and enum support
- **Protection Packets**: Fault/Warning/Ok simulation with all protection kinds
- **State Packets**: State machine transitions with realistic timing
- **Order Packets**: Command acknowledgment simulation with status tracking

### Simulation Features
- **Realistic Value Generation**: Using safe/warning ranges from ADJ configuration
- **Enum State Management**: Proper enum transitions and state persistence
- **Timestamp Simulation**: RTC-like timestamping for accurate timing
- **Multi-board Support**: Simultaneous simulation of all board types

## Installation

### Prerequisites
- Go 1.23.0 or later
- Access to the h9-backend ADJ configuration

### Build from Source
```bash
cd packet-sender
go build -o packet-sender .
```

### Development Setup
```bash
# Via development scripts
./scripts/dev.sh setup
./scripts/dev.sh packet
```

## Quick Start

### Basic Usage
```bash
# List available boards
./packet-sender list boards

# List packets for a specific board
./packet-sender list packets --board BCU

# Run all boards with default settings
./packet-sender run

# Run specific boards with enhanced features
./packet-sender run --boards BCU,LCU --enable-protections --enable-states
```

### Common Scenarios
```bash
# Development testing with TCP
./packet-sender run --protocol tcp --enable-protections --enable-states

# High-frequency testing
./packet-sender run --packet-interval 50ms --boards VCU

# Real-time monitoring
./packet-sender run --monitor --log-level debug

# Single board testing
./packet-sender run --boards BCU --protocol udp
```

## CLI Reference

### Main Commands

#### `list`
Explore available boards and packets

```bash
# List all boards
packet-sender list boards [--details]

# List packets for a board
packet-sender list packets --board BOARD_NAME [--type TYPE] [--details]

# List all packet types
packet-sender list types
```

#### `run`
Start the board simulator

```bash
packet-sender run [flags]
```

**Flags:**
- `--boards` (strings): Boards to simulate (default: all)
- `--backend-address` (string): Backend address (default: "127.0.0.9")
- `--backend-port` (int): Backend port (default: 8000)
- `--protocol` (string): Protocol tcp/udp (default: "tcp")
- `--packet-interval` (duration): Packet generation interval (default: 100ms)
- `--reconnect-interval` (duration): Reconnection interval (default: 5s)
- `--max-retries` (int): Maximum connection retries (default: 10)
- `--enable-protections`: Enable protection packet simulation
- `--enable-states`: Enable state transition simulation
- `--enable-orders`: Enable order acknowledgment simulation
- `--monitor`: Enable real-time monitoring dashboard
- `--log-level` (string): Log level debug/info/warn/error (default: "info")

#### `send`
Send custom packets for testing

```bash
# Send custom data packet
packet-sender send data --board BCU --packet-id 123 --data '{"temperature": 25.5}'

# Send protection fault
packet-sender send protection --board LCU --severity fault --kind above --name "temperature" --value 85.0 --bound 80.0

# Send state transition
packet-sender send state --board VCU --to-state RUNNING --reason "Manual activation"

# Send order acknowledgment
packet-sender send order --board OBCCU --packet-id 456 --order-id 12345 --status completed
```

### Global Flags
- `--config` (string): Config file path
- `--verbose`: Enable verbose output
- `--help`: Show help information

## Configuration

### Configuration File
The packet sender supports YAML configuration files for persistent settings:

```yaml
# ~/.packet-sender.yaml
backend-address: "127.0.0.9"
backend-port: 8000
protocol: "tcp"
packet-interval: "100ms"
reconnect-interval: "5s"
max-retries: 10
enable-protections: true
enable-states: true
enable-orders: false
log-level: "info"
```

### Environment Variables
Configuration can also be set via environment variables:
```bash
export PACKET_SENDER_BACKEND_ADDRESS="192.168.1.100"
export PACKET_SENDER_PROTOCOL="tcp"
export PACKET_SENDER_LOG_LEVEL="debug"
```

### Board Configuration
Board configuration is automatically loaded from the ADJ (Automatic Data Jockey) system:
- **Automatic ADJ Sync**: Copies latest configuration from backend
- **Board Discovery**: Automatically detects available boards
- **Packet Definitions**: Uses real packet structures and variables
- **Range Validation**: Respects safe/warning ranges for realistic data

## Board Simulation

### Connection Simulation
- **TCP Client Mode**: Connects to backend as individual board clients
- **UDP Mode**: Sends packets via UDP for testing different scenarios
- **Auto-reconnection**: Maintains connections with exponential backoff
- **Connection Monitoring**: Real-time status tracking and reporting

### Data Generation
- **Realistic Patterns**: Sine-wave generation for smooth, realistic data
- **Enum Management**: Proper enum state transitions with persistence
- **Range Compliance**: Values generated within safe/warning ranges
- **Type Safety**: Correct binary encoding for all data types

### Protection Simulation
- **Fault Conditions**: Simulates out-of-bounds, above/below threshold conditions
- **Warning Generation**: Creates warning conditions based on measurement ranges
- **Recovery Simulation**: Generates OK packets to clear fault conditions
- **Timestamp Accuracy**: RTC-like timestamps for proper timing

### State Machine Modeling
- **Realistic Transitions**: IDLE → STARTUP → READY → RUNNING flow
- **Probability-based Logic**: Natural state progression with realistic timing
- **Emergency Handling**: Fault and emergency state simulation
- **Transition Reasons**: Proper reason codes and documentation

## Development Integration

### Development Scripts
```bash
# Start packet sender via development scripts
./scripts/dev.sh packet

# Start all services including packet sender
./scripts/dev.sh all

# Setup development environment
./scripts/dev.sh setup
```

### Manual Usage
```bash
# Direct execution with full control
./packet-sender run --help

# Custom configuration for specific testing
./packet-sender run --boards BCU,LCU --protocol tcp --enable-protections

# Integration testing
./packet-sender run --monitor --log-level debug
```

### Backend Compatibility
- **Protocol Compatibility**: Same packet formats and encoding as real boards
- **IP Mapping**: Proper IP address mapping for board identification
- **Sniffer Integration**: Compatible with backend packet sniffing
- **Transport Layer**: Full integration with backend transport layer

## Troubleshooting

### Common Issues

#### Connection Refused
```
Failed to connect board BCU: connection refused
```
**Solution**: Ensure the backend is running on the specified address and port.

#### ADJ Load Errors
```
Error: failed to load ADJ: permission denied
```
**Solution**: Remove the `adj` directory and let the tool recreate it with proper permissions.

#### Packet Generation Issues
```
No packets found for board 'BCU'
```
**Solution**: Verify the ADJ configuration includes packet definitions for the specified board.

### Debug Mode
Enable detailed logging for troubleshooting:
```bash
./packet-sender run --log-level debug --verbose
```

### Connection Testing
Test specific protocols and settings:
```bash
# Test UDP connection
./packet-sender run --protocol udp --boards BCU

# Test with minimal features
./packet-sender run --boards BCU --packet-interval 1s
```

### Performance Tuning
Adjust settings for different testing scenarios:
```bash
# High-frequency testing
./packet-sender run --packet-interval 10ms --max-retries 3

# Conservative testing
./packet-sender run --packet-interval 500ms --reconnect-interval 10s
```

### Monitoring and Statistics
Use the monitoring dashboard for real-time insights:
```bash
./packet-sender run --monitor --log-level info
```

The monitoring dashboard provides:
- Connection status per board
- Packet transmission statistics
- Error rates and connection uptime
- Real-time performance metrics

## Advanced Usage

### Custom Packet Testing
Create specific test scenarios with custom packets:

```bash
# Test specific fault conditions
./packet-sender send protection --board VCU --severity fault --kind out_of_bounds --name "pressure" --value 150.0 --bound 100.0

# Test state machine transitions
./packet-sender send state --board BCU --to-state FAULT --reason "Emergency stop triggered"

# Test order acknowledgments
./packet-sender send order --board LCU --packet-id 200 --order-id 999 --status executing
```

### Scripting and Automation
The packet sender can be integrated into automated testing scripts:

```bash
#!/bin/bash
# Start packet sender in background
./packet-sender run --boards BCU --log-level warn &
PACKET_PID=$!

# Run tests
sleep 5
echo "Running integration tests..."

# Cleanup
kill $PACKET_PID
```

### Configuration Profiles
Create different configuration files for various testing scenarios:

```yaml
# testing.yaml - High-frequency testing
packet-interval: "10ms"
enable-protections: true
enable-states: true
log-level: "warn"

# development.yaml - Development testing  
packet-interval: "100ms"
enable-protections: false
enable-states: false
log-level: "debug"
```

Use with: `./packet-sender run --config testing.yaml`

## Support and Contributing

For issues, feature requests, or contributions, please refer to the project repository and development documentation.

The packet sender is designed to be a comprehensive, professional tool for board simulation and backend testing, providing accurate recreation of real board behavior for thorough system validation.