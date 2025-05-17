package tcp

import (
	"errors"
	"fmt"
	"net"
	"syscall"
	"time"

	"github.com/rs/zerolog"
)

type Client struct {
	config  ClientConfig
	address string

	currentRetries int

	logger zerolog.Logger
}

// NewClient inits a ClientConfig with good defaults and the provided information
func NewClient(address string, config ClientConfig, baseLogger zerolog.Logger) Client {
	logger := baseLogger.With().Str("localAddres", config.LocalAddr.String()).Str("remoteAddress", address).Logger()
	return Client{
		config: config,

		address: address,

		currentRetries: 0,

		logger: logger,
	}
}

// Dial attempts to connect with the client
func (client *Client) Dial() (net.Conn, error) {

	var err error
	var conn net.Conn
	client.logger.Info().Msg("dialing")
	// The max connection retries will not work because the for loop never completes, it always returns and the function is called again by transport.
	for client.config.MaxConnectionRetries <= 0 || client.currentRetries < client.config.MaxConnectionRetries {
		client.currentRetries++
		conn, err = client.config.DialContext(client.config.Context, "tcp", client.address)

		backoffDuration := client.config.ConnectionBackoffFunction(client.currentRetries)
		client.logger.Error().Stack().Err(err).Dur("backoff", backoffDuration).Int("retries", client.currentRetries+1).Msg("retrying")
		time.Sleep(backoffDuration)

		if err == nil {
			client.logger.Info().Msg("connected")
			client.currentRetries = 0
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
	}

	client.logger.Debug().Int("max", client.config.MaxConnectionRetries).Msg("max connection retries exceeded")
	return nil, ErrTooManyRetries{
		Max:     client.config.MaxConnectionRetries,
		Network: "tcp",
		Remote:  client.address,
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
