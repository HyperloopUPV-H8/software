package tcp

import (
	"net"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type Address string

type serverTargets = map[Address]abstraction.TransportTarget

type TCPServer struct {
	name         abstraction.TransportTarget
	targets      serverTargets
	listener     *net.TCPListener
	keepalive    time.Duration
	onConnection connectionCallback
	onError      errorCallback
}

func NewServer(name abstraction.TransportTarget, laddr string, targets serverTargets) (*TCPServer, error) {
	localAddr, err := net.ResolveTCPAddr("tcp", laddr)
	if err != nil {
		return nil, err
	}

	listener, err := net.ListenTCP("tcp", localAddr)
	if err != nil {
		return nil, err
	}

	return &TCPServer{
		name:      name,
		targets:   targets,
		listener:  listener,
		keepalive: 0,
	}, nil
}

func (server *TCPServer) SetKeepalive(keepalive time.Duration) {
	server.keepalive = keepalive
}

func (server *TCPServer) SetOnConnection(callback connectionCallback) {
	server.onConnection = callback
}

func (server *TCPServer) SetOnError(callback errorCallback) {
	server.onError = callback
}

func (server *TCPServer) Run() {
	for {
		conn, err := server.listener.AcceptTCP()
		if err != nil {
			server.onError(server.name, err)
			continue
		}

		target, ok := server.targets[Address(conn.RemoteAddr().String())]
		if !ok {
			conn.Close()
			continue
		}

		err = conn.SetKeepAlive(server.keepalive > 0)
		if err != nil {
			server.onError(server.name, err)
			conn.Close()
			continue
		}

		err = conn.SetKeepAlivePeriod(server.keepalive)
		if err != nil {
			server.onError(server.name, err)
			conn.Close()
			continue
		}

		server.onConnection(target, conn)
	}
}

func (server *TCPServer) Close() error {
	return server.listener.Close()
}
