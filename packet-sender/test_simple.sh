#!/bin/bash

echo "Simple Packet Sender Test"
echo "========================="

# Start listener
echo "1. Starting listener on 127.0.0.9:8000"
echo "   (This will receive packets)"
echo ""
./target/release/packet-sender listen -a 127.0.0.9:8000