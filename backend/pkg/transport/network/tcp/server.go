package tcp

import (
	"net"

	"github.com/rs/zerolog"
)

type connectionCallback = func(conn net.Conn)

type Server struct {
	config    ServerConfig
	closeChan chan struct{}

	address string

	whitelist map[net.Addr]struct{}

	onConnection connectionCallback

	logger *zerolog.Logger
}

// NewServer inits a new ServerConfig with good defaults and the provided values
func NewServer(address string, config ServerConfig, baseLogger *zerolog.Logger) Server {
	logger := baseLogger.With().Caller().Timestamp().Str("localAddres", address).Logger()
	return Server{
		config:    config,
		closeChan: make(chan struct{}),

		address: address,

		whitelist: make(map[net.Addr]struct{}),

		onConnection: func(conn net.Conn) {
			defer conn.Close()
			logger.Warn().Str("remoteAddress", conn.RemoteAddr().String()).Msg("connection callback not set yet")
		},

		logger: &logger,
	}
}

// Listen binds the server to its addres and starts listening for incoming connections.
//
// Listen will block until an error is encountered.
func (server *Server) Listen() error {
	listener, err := server.config.ListenConfig.Listen(server.config.Context, "tcp", server.address)
	if err != nil {
		server.logger.Error().Stack().Err(err).Msg("listening")
		return err
	}
	defer listener.Close()
	server.logger.Info().Msg("listening")
	defer server.logger.Info().Msg("stopped listening")

	errChan := make(chan error, 1)
	go func() {
		for {
			conn, err := listener.Accept()
			if err != nil {
				server.logger.Error().Stack().Err(err).Msg("accept")
				errChan <- err
				break
			}

			if !server.IsWhitelisted(conn.RemoteAddr()) {
				server.logger.Warn().Str("remoteAddress", conn.RemoteAddr().String()).Msg("unauthorized connection")
				conn.Close()
				continue
			}
			server.logger.Debug().Str("remoteAddress", conn.RemoteAddr().String()).Msg("new connection")

			server.onConnection(conn)
		}
	}()

	select {
	case <-server.closeChan:
		return nil
	case err := <-errChan:
		return err
	}
}

// IsWhitelisted checks if the address is in the server whitelist
func (server *Server) IsWhitelisted(addr net.Addr) bool {
	_, ok := server.whitelist[addr]
	return ok
}

// AddToWhitelist adds a new address to the server whitelist
func (server *Server) AddToWhitelist(addr net.Addr) {
	server.whitelist[addr] = struct{}{}
	server.logger.Trace().Str("address", addr.String()).Msg("added to whitelist")
}

// RemoveafromWhitelist removes an address from the server whitelist
func (server *Server) RemoveFromWhitelist(addr net.Addr) {
	delete(server.whitelist, addr)
	server.logger.Trace().Str("address", addr.String()).Msg("removed from whitelist")
}

// OnConnection sets the callback that will be used when a new connection is created
func (server *Server) OnConnection(callback connectionCallback) {
	server.onConnection = callback
	server.logger.Trace().Msg("changed connection logic")
}

// Close closes the server and stops listening for connections
func (server *Server) Close() {
	server.logger.Debug().Msg("closing")
	defer server.logger.Debug().Msg("closed")
	server.closeChan <- struct{}{}
}
