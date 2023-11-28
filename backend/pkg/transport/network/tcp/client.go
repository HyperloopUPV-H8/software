package tcp

import (
	"context"
	"fmt"
	"net"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type backoffFunction = func(int) time.Duration

const (
	defaultBackoffMin time.Duration = 100 * time.Millisecond
	defaultBackoffExp float32       = 1.5
	defaultBackoffMax time.Duration = 5 * time.Second
)

// NewExponBackoff returns an exponential backoff function with the given paramenters.
//
// It follows this formula: delay = (min * (exp ^ n); delay < max ? delay : max
func NewExponBackoff(min time.Duration, exp float32, max time.Duration) backoffFunction {
	return func(n int) time.Duration {
		curr := min
		for i := 0; curr < max && i < n; i++ {
			curr = time.Duration(exp * float32(curr))
		}
		if curr > max {
			return max
		}

		return curr
	}
}

// ClientConfig defines multiple configuration options for client operations
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
}

// NewClient inits a ClientConfig with good defaults and the provided information
func NewClient(local net.Addr) ClientConfig {
	return ClientConfig{
		Dialer: net.Dialer{
			Timeout:   time.Second,
			KeepAlive: -1,
			LocalAddr: local,
		},

		Context: context.TODO(),

		MaxRetries: 15,
		Backoff:    NewExponBackoff(defaultBackoffMin, defaultBackoffExp, defaultBackoffMax),
	}
}

// Dial attempts to create a connection with the specified remote using the client configuration.
func (config ClientConfig) Dial(network, remote string) (net.Conn, error) {
	var err error
	for ; config.CurrentRetries != config.MaxRetries; config.CurrentRetries++ {
		var conn net.Conn
		conn, err = config.DialContext(config.Context, network, remote)
		if err == nil {
			return conn, nil
		}
		if config.Context.Err() != nil {
			return nil, config.Context.Err()
		}

		if netErr, ok := err.(net.Error); !ok || !netErr.Timeout() {
			return nil, err
		}
		time.Sleep(config.Backoff(config.CurrentRetries))
	}

	return nil, ErrTooManyRetries{
		Max:     config.MaxRetries,
		Network: network,
		Remote:  remote,
	}
}

type ErrTooManyRetries struct {
	Max     int
	Network string
	Remote  string
}

func (err ErrTooManyRetries) Error() string {
	return fmt.Sprintf("tried to reconnect over %d times to %s over %s", err.Max, err.Network, err.Remote)
}
