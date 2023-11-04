package pipe

type Config struct {
	TcpClientTag    string
	TcpServerTag    string
	Mtu             uint
	KeepAliveProbes int
}
