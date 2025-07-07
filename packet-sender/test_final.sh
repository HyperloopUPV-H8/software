#!/bin/bash

echo "Testing Packet Sender - Final Version"
echo "====================================="
echo ""

# Test 1: List boards
echo "1. Available boards:"
./target/release/packet-sender list

echo -e "\n2. Testing BCU random generation (5 seconds):"
timeout 5s ./target/release/packet-sender random -b BCU -r 10 2>&1 | grep -E "(INFO|ERROR|packets)" | head -10

echo -e "\n3. Testing HVSCU random generation (5 seconds):"
timeout 5s ./target/release/packet-sender random -b HVSCU -r 10 2>&1 | grep -E "(INFO|ERROR|packets)" | head -10

echo -e "\n✅ Test complete!"
echo "Note: 'Connection refused' errors are expected without a backend running"