package tcp

import (
	"context"
	"net"
)

// ClientConfig defines all configuration options for TCP client connections
type ClientConfig struct {
	net.Dialer

	Context context.Context

	TryReconnect              bool
	ConnectionBackoffFunction backoffFunction
	MaxConnectionRetries      uint
}

// ServerConfig defines all configuration options for TCP server connections
type ServerConfig struct {
	net.ListenConfig

	Context context.Context
}
