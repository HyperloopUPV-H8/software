package tcp

type TCPServer struct {
	onConnection connectionCallback
	onError      errorCallback
}

func (server *TCPServer) SetOnConnection(callback connectionCallback) {
	server.onConnection = callback
}

func (server *TCPServer) SetOnError(callback errorCallback) {
	server.onError = callback
}

func (server *TCPServer) Run() {

}
