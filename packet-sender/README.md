# Hyperloop Packet Sender (Rust)

A professional network packet sender for testing the Hyperloop backend and frontend. This tool simulates board communications by generating and sending packets from simulated board IPs to the backend.

## Features

- **macOS-optimized**: Special handling for macOS localhost networking
- **Proper IP simulation**: Each board uses its actual IP from the ADJ configuration
- **Multiple packet types**: Support for data, protection, and other packet types
- **Flexible generation modes**: Random, sine wave, and sequence patterns
- **Interactive CLI**: User-friendly command-line interface
- **High performance**: Built with Rust and Tokio for efficient async networking

## Architecture

The packet sender is built with a modular architecture:

- **ADJ Module**: Parses and manages board configurations
- **Network Module**: Handles UDP sockets with macOS-specific optimizations
- **Generator Module**: Creates packets with realistic data
- **CLI Module**: Provides interactive and batch operation modes

## Key Improvements Over Go Version

1. **Correct Network Configuration**: Uses actual board IPs instead of hardcoded addresses
2. **macOS Compatibility**: Proper socket options for localhost communication
3. **Type Safety**: Rust's type system prevents packet format errors
4. **Better Performance**: Zero-copy packet generation where possible
5. **Comprehensive Error Handling**: No silent failures

## Building

```bash
cargo build --release
```

## Quick Start

### Testing Without Backend

1. **Start a test listener** (in one terminal):
```bash
./target/release/packet-sender listen
# This starts a UDP listener on 127.0.0.9:8000
```

2. **Send packets** (in another terminal):
```bash
# Send random packets from BCU at 10 packets/second
./target/release/packet-sender random -b BCU -r 10

# Or use interactive mode
./target/release/packet-sender
> random BCU 20
```

## Usage

### Interactive Mode
```bash
./target/release/packet-sender
```

### Random Generation
```bash
# Generate packets from all boards at 100 pps
./target/release/packet-sender random

# Generate packets from specific board at 200 pps
./target/release/packet-sender random -b BCU -r 200
```

### Board Simulation
```bash
# Simulate BCU board with random data
./target/release/packet-sender board BCU --mode random

# Simulate with sine wave pattern
./target/release/packet-sender board BCU --mode sine
```

### List Available Boards
```bash
./target/release/packet-sender list
```

## Configuration

The tool automatically loads the ADJ (Abstract Data JSON) from the backend directory. You can specify a custom path:

```bash
./target/release/packet-sender --adj-path /path/to/adj
```

## macOS-Specific Features

The packet sender includes special handling for macOS:

- Sets `SO_REUSEADDR` and `SO_REUSEPORT` for multiple binds
- Configures `SO_NOSIGPIPE` to prevent crashes
- Optimizes buffer sizes for localhost communication
- Properly handles the `lo0` loopback interface

## Packet Format

Packets follow the backend's binary format:
- 2 bytes: Packet ID (little-endian)
- Variable data based on packet type and definition

## Development

### Adding New Packet Types

1. Update the `PacketType` enum in `src/adj/packet.rs`
2. Create a new generator in `src/generator/`
3. Add handling in `PacketGenerator::generate_packet()`

### Testing with Backend

1. Start the backend with sniffer enabled
2. Run the packet sender
3. Monitor backend logs for received packets

## Troubleshooting

### "Address already in use" errors
- The tool sets SO_REUSEADDR/PORT, but check for other processes
- Use `lsof -i :PORT` to find conflicting processes

### Packets not reaching backend
- Verify backend is listening on the correct address/port
- Check firewall settings (especially on macOS)
- Use Wireshark to monitor localhost traffic

## Future Enhancements

- [ ] TUI mode with real-time statistics
- [ ] Packet replay from captured files
- [ ] Fault injection scenarios
- [ ] Performance benchmarking mode
- [ ] Integration tests with backend