package network

// Socket defines a unique conversation over a network by using the source and destination
// IP addresses and TCP/UDP ports.
type Socket struct {
	SrcIP   string
	SrcPort uint16
	DstIP   string
	DstPort uint16
}
