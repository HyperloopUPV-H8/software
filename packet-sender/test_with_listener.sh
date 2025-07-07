#!/bin/bash

echo "Testing Packet Sender with Local Listener"
echo "========================================="

# Start listener in background
echo "Starting test listener on 127.0.0.9:8000..."
./target/release/packet-sender listen &
LISTENER_PID=$!

# Wait for listener to start
sleep 2

# Test sending packets
echo -e "\nSending test packets from BCU..."
timeout 3s ./target/release/packet-sender random -b BCU -r 10 &
SENDER_PID=$!

# Wait a bit
sleep 5

# Clean up
echo -e "\nStopping processes..."
kill $SENDER_PID 2>/dev/null
kill $LISTENER_PID 2>/dev/null

echo "Test completed!"