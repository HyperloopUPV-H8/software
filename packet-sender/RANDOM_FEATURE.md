# Random Packet Generation Feature

The packet-sender now supports sending random packets from all boards when no specific board is specified.

## Usage

### Command Line

```bash
# Send random packets from all boards at default rate (100 pps)
packet-sender random

# Send random packets from all boards at specific rate
packet-sender random --rate 200

# Send random packets from a specific board (existing behavior)
packet-sender random --board LCU --rate 150
```

### Interactive Mode

```bash
# Start interactive mode
packet-sender interactive

# In the interactive prompt:
> random              # Random from all boards at 100 pps
> random 200          # Random from all boards at 200 pps  
> random LCU          # Random from LCU board at 100 pps
> random LCU 150      # Random from LCU board at 150 pps
```

## How it Works

When no board is specified, the packet-sender will:
1. Randomly select a board from all available boards
2. Generate a random data packet from that board
3. Send the packet with appropriate random values for all measurements
4. Repeat the process at the specified rate

This simulates a more realistic scenario where packets arrive from different boards in an unpredictable order.