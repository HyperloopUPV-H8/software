#!/bin/bash

echo "Testing Hyperloop Packet Sender"
echo "==============================="

# Test listing boards
echo -e "\n1. Testing list command:"
./target/release/packet-sender list

# Test interactive help
echo -e "\n2. Testing interactive mode (type 'help' then 'quit'):"
echo -e "help\nlist\nboard BCU\nquit" | ./target/release/packet-sender

# Test sending specific packets
echo -e "\n3. Testing random packet generation for 2 seconds:"
timeout 2s ./target/release/packet-sender random -b BCU -r 10 || true

echo -e "\n✅ Tests completed!"