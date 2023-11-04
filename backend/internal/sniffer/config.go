package sniffer

type Config struct {
	TcpClientTag string
	TcpServerTag string
	UdpTag       string
	Mtu          uint
	Interface    string
}
