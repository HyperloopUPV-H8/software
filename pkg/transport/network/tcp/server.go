package tcp

import (
	"net"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

// Address is an alias for string encoded network addresses (e.g. "127.0.0.1:4040")
type Address = string

// serverTargets are the addresses are expected to connect and their respective target name
type serverTargets = map[Address]abstraction.TransportTarget

// Assertion to check the TCPServer is a TCPSource
var _ TCPSource = &TCPServer{}

// TCPServer is a TCPSource that gets connections from clients
//
// TCPServer must be used as any other TCPSource.
type TCPServer struct {
	name         abstraction.TransportTarget
	targets      serverTargets
	listener     *net.TCPListener
	keepalive    time.Duration
	onConnection connectionCallback
	onError      errorCallback
}

// NewServer creates a new TCPServer with the given name, local address and target connections.
// It returns a non nil error if it fails to resolve the local address or when the listener creation fails.
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

// SetKeepalive sets the keepalive that will be applied to the connections established
func (server *TCPServer) SetKeepalive(keepalive time.Duration) {
	server.keepalive = keepalive
}

// SetOnConnection registers the callback that will be used when a connection is made
func (server *TCPServer) SetOnConnection(callback connectionCallback) {
	server.onConnection = callback
}

// SetOnError registers the callback that will be used when an error making the connection occurs.
func (server *TCPServer) SetOnError(callback errorCallback) {
	server.onError = callback
}

// accept result is an auxiliary struct to pass the results of listener.Accept through a channel
type acceptResult struct {
	conn *net.TCPConn
	err  error
}

// Run starts the TCPServer.
//
// When a conneciton is established, it first checks if it's valid, then configures it and lastly
// notifies of the connection with the OnConnection callback.
//
// Callers should make sure the OnConnection and the OnError callbacks are provided before calling Run.
//
// The server execution can be stopped by sending a message to the cancel channel.
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

// configureConn is a helper to apply all configuration to a connection.
func (server *TCPServer) configureConn(conn *net.TCPConn) error {
	err := conn.SetKeepAlive(server.keepalive > 0)
	if err != nil {
		return err
	}

	return conn.SetKeepAlivePeriod(server.keepalive)
}
