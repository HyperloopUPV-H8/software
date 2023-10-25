package tcp

type TCPServer struct {
	onConnection func(*TCPConn)
}

func (server *TCPServer) SetOnConnection(callback func(*TCPConn)) {
	server.onConnection = callback
}
