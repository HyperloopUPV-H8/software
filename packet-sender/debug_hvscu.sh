#!/bin/bash

echo "Debugging HVSCU packets..."
echo -e "board HVSCU\nquit" | ./target/release/packet-sender 2>&1 | grep -E "(Data packets:|^\s+\[[0-9]+\])" | head -20