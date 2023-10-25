package tcp

type TCPSource interface {
	SetOnConnection(func(*TCPConn))
}

type TCPConn struct{}
