package tcp

import (
	"net"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type Address string

type serverTargets = map[Address]abstraction.TransportTarget

// Assertion to check the TCPServer is a TCPSource
var _ TCPSource = &TCPServer{}

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

type acceptResult struct {
	conn *net.TCPConn
	err  error
}

func (server *TCPServer) Run(cancel <-chan struct{}) {
	defer server.listener.Close()
	for {
		acceptChan := make(chan acceptResult)

		go func(acceptChan chan<- acceptResult) {
			conn, err := server.listener.AcceptTCP()
			acceptChan <- acceptResult{conn, err}
		}(acceptChan)

		var conn *net.TCPConn
		var err error
		select {
		case result := <-acceptChan:
			conn = result.conn
			err = result.err
		case <-cancel:
			return
		}

		if err != nil {
			server.onError(server.name, err)
			continue
		}

		target, ok := server.targets[Address(conn.RemoteAddr().String())]
		if !ok {
			conn.Close()
			continue
		}

		err = server.configureConn(conn)
		if err != nil {
			conn.Close()
			server.onError(server.name, err)
			continue
		}

		server.onConnection(target, conn)
	}
}

func (server *TCPServer) configureConn(conn *net.TCPConn) error {
	err := conn.SetKeepAlive(server.keepalive > 0)
	if err != nil {
		return err
	}

	return conn.SetKeepAlivePeriod(server.keepalive)
}
