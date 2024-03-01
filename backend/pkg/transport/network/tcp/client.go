package tcp

import (
	"errors"
	"fmt"
	"net"
	"syscall"
	"time"

	"github.com/rs/zerolog"
)

type backoffFunction = func(uint) time.Duration

const (
	defaultBackoffMin time.Duration = 100 * time.Millisecond
	defaultBackoffExp float32       = 1.5
	defaultBackoffMax time.Duration = 5 * time.Second
)

// NewExponBackoff returns an exponential backoff function with the given paramenters.
//
// It follows this formula: delay = (min * (exp ^ n); delay < max ? delay : max
func NewExponBackoff(min time.Duration, exp float32, max time.Duration) backoffFunction {
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

type Client struct {
	config ClientConfig

	address string

	currentRetries uint

	logger *zerolog.Logger
}

// NewClient inits a ClientConfig with good defaults and the provided information
func NewClient(address string, config ClientConfig, baseLogger *zerolog.Logger) Client {
	logger := baseLogger.With().Caller().Timestamp().Str("localAddres", config.LocalAddr.String()).Str("remoteAddress", address).Logger()
	return Client{
		config: config,

		address: address,

		currentRetries: 0,

		logger: &logger,
	}
}

// Dial attempts to connect with the client
func (client *Client) Dial() (net.Conn, error) {
	var err error
	var conn net.Conn
	client.logger.Info().Msg("dialing")
	for ; client.currentRetries < client.config.MaxConnectionRetries; client.currentRetries++ {
		conn, err = client.config.DialContext(client.config.Context, "tcp", client.address)
		if err == nil {
			client.logger.Info().Msg("connected")
			return conn, nil
		}
		if client.config.Context.Err() != nil {
			client.logger.Error().Stack().Err(client.config.Context.Err()).Msg("canceled")
			return nil, client.config.Context.Err()
		}

		if netErr, ok := err.(net.Error); !client.config.TryReconnect || (!errors.Is(err, syscall.ECONNREFUSED) && (!ok || !netErr.Timeout())) {
			client.logger.Error().Stack().Err(err).Msg("failed")
			return nil, err
		}

		backoffDuration := client.config.ConnectionBackoffFunction(client.currentRetries)
		client.logger.Debug().Stack().Err(err).Dur("backoff", backoffDuration).Uint("retries", client.currentRetries+1).Msg("retrying")
		time.Sleep(backoffDuration)
	}

	client.logger.Debug().Uint("max", client.config.MaxConnectionRetries).Msg("max connections exceeded")
	return nil, ErrTooManyRetries{
		Max:     client.config.MaxConnectionRetries,
		Network: "tcp",
		Remote:  client.address,
	}
}

type ErrTooManyRetries struct {
	Max     uint
	Network string
	Remote  string
}

func (err ErrTooManyRetries) Error() string {
	return fmt.Sprintf("tried to reconnect over %d times to %s over %s", err.Max, err.Network, err.Remote)
}
