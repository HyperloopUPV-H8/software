package tcp

import (
	"context"
	"net"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type connectionCallback = func(target abstraction.TransportTarget, conn net.Conn)

type address = string

// ServerConfig defines several configuration options for TCP server operations
type ServerConfig struct {
	net.ListenConfig

	// Context is the context for calls used with this configuration.
	// Cancelling the context means cancelling any runing tasks like listening to connections.
	Context context.Context

	// Targets is a list of connections which this server accepts and their related transport targets
	Targets map[address]abstraction.TransportTarget

	onConnection connectionCallback
}

// NewServer inits a new ServerConfig with good defaults and the provided values
func NewServer(targets map[address]abstraction.TransportTarget, onConnection connectionCallback) ServerConfig {
	return ServerConfig{
		ListenConfig: net.ListenConfig{
			KeepAlive: -1,
		},

		Context: context.TODO(),

		Targets: targets,

		onConnection: onConnection,
	}
}

// Listen listens for incoming TCP connections based on the server configuration.
//
// connections are notified through the config connection callback set previously.
// any errors encountered are returned, stopping the listener in the process.
func (config ServerConfig) Listen(network string, local string) error {
	listener, err := config.ListenConfig.Listen(config.Context, network, local)
	if err != nil {
		return err
	}
	defer listener.Close()

	for {
		conn, err := listener.Accept()
		if err != nil {
			return err
		}

		target, ok := config.Targets[conn.RemoteAddr().String()]
		if !ok {
			conn.Close()
			continue
		}

		config.onConnection(target, conn)
	}
}
