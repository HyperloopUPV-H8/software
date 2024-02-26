package tcp

import (
	"context"
	"net"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

// ClientConfig defines all configuration options for TCP client connections
type ClientConfig struct {
	net.Dialer

	// Context is the context used for the client. When cancelled, any attempts to connect to a
	// remote will be cancelled
	Context context.Context

	// Target is the transport target associated with this client
	Target abstraction.TransportTarget

	// MaxRetries defines how many times might this client attempt to connect after a failed attempt
	MaxRetries int
	// CurrentRetries is how many times the client has tried to reconnect
	CurrentRetries int
	// Backoff specifies the backoff algorithm for this client
	Backoff backoffFunction
	// AbortOnError specifies whether the client should abort on errors or keep trying to connect
	AbortOnError bool
}

// ServerConfig defines all configuration options for TCP server connections
type ServerConfig struct {
	net.ListenConfig

	Context context.Context
}
