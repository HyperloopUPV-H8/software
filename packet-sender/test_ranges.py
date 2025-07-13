#!/usr/bin/env python3
"""
Test script to verify that packet sender respects measurement ranges.
"""

import subprocess
import json
import socket
import struct
import threading
import time
from collections import defaultdict

# Test configuration
TEST_DURATION = 5  # seconds
UDP_PORT = 9999

# Storage for received values
received_values = defaultdict(list)
stop_flag = threading.Event()

def parse_packet(data, board_ip):
    """Parse a packet and extract values."""
    if len(data) < 2:
        return
    
    packet_id = struct.unpack('>H', data[:2])[0]
    offset = 2
    
    # For simplicity, just extract float32 values
    values = []
    while offset + 4 <= len(data):
        try:
            value = struct.unpack('>f', data[offset:offset+4])[0]
            values.append(value)
            offset += 4
        except:
            break
    
    if values:
        key = f"{board_ip}_packet_{packet_id}"
        received_values[key].extend(values)

def udp_listener():
    """Listen for UDP packets."""
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind(('127.0.0.1', UDP_PORT))
    sock.settimeout(0.1)
    
    print(f"Listening on UDP port {UDP_PORT}...")
    
    while not stop_flag.is_set():
        try:
            data, addr = sock.recvfrom(4096)
            parse_packet(data, addr[0])
        except socket.timeout:
            continue
        except Exception as e:
            print(f"Error receiving packet: {e}")
    
    sock.close()

def main():
    # Start UDP listener
    listener_thread = threading.Thread(target=udp_listener)
    listener_thread.start()
    
    # Give listener time to start
    time.sleep(0.5)
    
    # Start packet sender in random mode
    print("Starting packet sender...")
    process = subprocess.Popen([
        './target/release/packet-sender',
        '-b', '127.0.0.1',
        '-p', str(UDP_PORT),
        '-d',  # Dev mode to send directly
        'random',
        '--rate', '10'  # 10 packets per second
    ])
    
    # Let it run for a while
    print(f"Collecting packets for {TEST_DURATION} seconds...")
    time.sleep(TEST_DURATION)
    
    # Stop packet sender
    process.terminate()
    process.wait()
    
    # Stop listener
    stop_flag.set()
    listener_thread.join()
    
    # Analyze results
    print("\nAnalysis of received values:")
    print("-" * 50)
    
    for key, values in received_values.items():
        if values:
            min_val = min(values)
            max_val = max(values)
            avg_val = sum(values) / len(values)
            
            print(f"\n{key}:")
            print(f"  Samples: {len(values)}")
            print(f"  Min: {min_val:.2f}")
            print(f"  Max: {max_val:.2f}")
            print(f"  Avg: {avg_val:.2f}")
            
            # Check for reasonable ranges
            if max_val > 10000:
                print(f"  ⚠️  Warning: Very high values detected!")
            if min_val < -10000:
                print(f"  ⚠️  Warning: Very low values detected!")
            
            # Show value distribution
            if len(values) > 10:
                sorted_vals = sorted(values)
                p10 = sorted_vals[len(sorted_vals)//10]
                p90 = sorted_vals[9*len(sorted_vals)//10]
                print(f"  10th percentile: {p10:.2f}")
                print(f"  90th percentile: {p90:.2f}")

if __name__ == "__main__":
    main()