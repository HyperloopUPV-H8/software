package tcp

type TCPClient struct {
	onConnection func(*TCPConn)
}

func (client *TCPClient) SetOnConnection(callback func(*TCPConn)) {
	client.onConnection = callback
}
