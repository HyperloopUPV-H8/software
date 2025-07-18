#!/bin/bash

echo "Testing manual packet sending feature..."
echo ""
echo "Make sure the backend is running before testing!"
echo ""
echo "To test the manual packet sending:"
echo "1. Run: cargo run -- interactive"
echo "2. Type: list (to see available boards)"
echo "3. Type: manual <board_name> (e.g., manual VCU)"
echo "4. Follow the prompts to select a packet"
echo "5. Choose random or custom values"
echo "6. If custom, enter values for each variable"
echo ""
echo "Example commands to try:"
echo "  list"
echo "  board VCU"
echo "  manual VCU"