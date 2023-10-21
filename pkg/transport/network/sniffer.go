package network

type Socket struct {
	LocalIP    string
	LocalPort  uint16
	RemoteIP   string
	RemotePort uint16
}

type Sniffer struct{}
