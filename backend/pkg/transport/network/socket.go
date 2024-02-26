package network

import "net"

// Socket defines a unique conversation over a network by using the source and destination
// IP addresses and TCP/UDP ports.
type Socket struct {
	SrcIP   net.IP
	SrcPort uint16
	DstIP   net.IP
	DstPort uint16
}
