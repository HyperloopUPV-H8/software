package tcp

import (
	"context"
	"net"
	"time"
)

// ClientConfig defines all configuration options for TCP client connections
type ClientConfig struct {
	net.Dialer

	Context context.Context

	TryReconnect              bool
	ConnectionBackoffFunction backoffFunction
	MaxConnectionRetries      uint
}

// NewClientConfig creates a new client configuration with good defaults
func NewClientConfig(laddr net.Addr) ClientConfig {
	return ClientConfig{
		Dialer: net.Dialer{
			Timeout:   time.Second * 5,
			LocalAddr: laddr,
			KeepAlive: time.Second, // Going under 1 second won't work in most systems
		},

		Context:                   context.TODO(),
		TryReconnect:              true,
		ConnectionBackoffFunction: NewExponentialBackoff(defaultBackoffMin, defaultBackoffExp, defaultBackoffMax),
		MaxConnectionRetries:      10,
	}
}

type backoffFunction = func(uint) time.Duration

const (
	defaultBackoffMin time.Duration = 100 * time.Millisecond
	defaultBackoffExp float32       = 1.5
	defaultBackoffMax time.Duration = 5 * time.Second
)

// NewExponentialBackoff returns an exponential backoff function with the given paramenters.
//
// It follows this formula: delay = (min * (exp ^ n); delay < max ? delay : max
func NewExponentialBackoff(min time.Duration, exp float32, max time.Duration) backoffFunction {
	return func(n uint) time.Duration {
		curr := min
		for i := uint(0); curr < max && i < n; i++ {
			curr = time.Duration(exp * float32(curr))
			if curr >= max {
				return max
			}
		}
		return curr
	}
}

// ServerConfig defines all configuration options for TCP server connections
type ServerConfig struct {
	net.ListenConfig

	Context context.Context
}
