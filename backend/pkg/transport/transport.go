package transport

import (
	"errors"
	"fmt"
	"io"
	"net"
	"sync"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/sniffer"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/tcp"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/tftp"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/presentation"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/session"
	"github.com/rs/zerolog"
)

// Transport is the module in charge of handling network communication with
// the vehicle.
//
// It uses events to differentiate different kinds of messages. Each message
// or notification has an associated event which is used to determine the
// action to take.
type Transport struct {
	decoder *presentation.Decoder
	encoder *presentation.Encoder

	connectionsMx *sync.Mutex
	connections   map[abstraction.TransportTarget]net.Conn

	ipToTarget map[string]abstraction.TransportTarget
	idToTarget map[abstraction.PacketId]abstraction.TransportTarget

	tftp *tftp.Client

	api abstraction.TransportAPI

	logger *zerolog.Logger
}

// HandleClient connects to the specified client and handles its messages. This method blocks.
// This method will try to reconnect to the client if it disconnects mid way through, but after
// enough retries, it will stop.
func (transport *Transport) HandleClient(config tcp.ClientConfig, remote string) error {
	client := tcp.NewClient(remote, config, transport.logger)
	defer transport.logger.Warn().Str("remoteAddress", remote).Msg("abort connection")

	for {
		conn, err := client.Dial()
		if err != nil {
			transport.logger.Debug().Stack().Err(err).Str("remoteAddress", remote).Msg("dial failed")
			if !config.TryReconnect {
				return err
			}

			continue
		}

		err = transport.handleTCPConn(conn)
		if errors.Is(err, error(ErrTargetAlreadyConnected{})) {
			transport.logger.Warn().Stack().Err(err).Str("remoteAddress", remote).Msg("multiple connections for same target")
			return err
		}
		if err != nil {
			transport.logger.Debug().Stack().Err(err).Str("remoteAddress", remote).Msg("dial failed")
			if !config.TryReconnect {
				return err
			}

			continue
		}
	}
}

// HandleServer creates a server on the specified address, listening for all incoming connections and
// handles them.
func (transport *Transport) HandleServer(config tcp.ServerConfig, local string) error {
	server := tcp.NewServer(local, config, transport.logger)
	server.OnConnection(transport.handleTCPConn)
	return server.Listen()
}

// handleTCPConn is used to handle the specific TCP connections to the boards. It detects errors caused
// on concurrent reads and writes, so other routines should not worry about closing or handling errors
func (transport *Transport) handleTCPConn(conn net.Conn) error {
	target, ok := transport.ipToTarget[conn.RemoteAddr().(*net.TCPAddr).IP.String()]
	if !ok {
		conn.Close()
		transport.logger.Warn().Str("remoteAddress", conn.RemoteAddr().String()).Msg("ip target not found")
		return ErrUnknownTarget{Remote: conn.RemoteAddr()}
	}

	connectionLogger := transport.logger.With().Str("remoteAddress", conn.RemoteAddr().String()).Str("target", string(target)).Logger()
	connectionLogger.Info().Msg("new connection")

	if err := func() error {
		transport.connectionsMx.Lock()
		defer transport.connectionsMx.Unlock()
		if _, ok := transport.connections[target]; ok {
			conn.Close()
			connectionLogger.Debug().Msg("already connected")
			return ErrTargetAlreadyConnected{Target: target}
		}
		return nil
	}(); err != nil {
		return err
	}

	if tcpConn, ok := conn.(*net.TCPConn); ok {
		connectionLogger.Trace().Msg("setting connection linger")
		err := tcpConn.SetLinger(0)
		if err != nil {
			connectionLogger.Error().Stack().Err(err).Msg("set linger")
		}

		connectionLogger.Trace().Msg("setting connection no delay")
		err = tcpConn.SetNoDelay(true)
		if err != nil {
			connectionLogger.Error().Stack().Err(err).Msg("set no delay")
		}
	}
	conn, errChan := tcp.WithErrChan(conn)
	defer func() {
		conn.Close()
		connectionLogger.Info().Msg("close")
	}()

	func() {
		transport.connectionsMx.Lock()
		defer transport.connectionsMx.Unlock()
		connectionLogger.Debug().Msg("added connection")
		transport.connections[target] = conn
	}()
	defer func() {
		transport.connectionsMx.Lock()
		defer transport.connectionsMx.Unlock()
		connectionLogger.Debug().Msg("removed connection")
		delete(transport.connections, target)
	}()

	transport.api.ConnectionUpdate(target, true)
	defer transport.api.ConnectionUpdate(target, false)

	go func() {
		for {
			packet, err := transport.decoder.DecodeNext(conn)
			if err != nil {
				connectionLogger.Error().Stack().Err(err).Msg("decode")
				break
			}

			from := conn.RemoteAddr().String()
			to := conn.LocalAddr().String()

			connectionLogger.Trace().Type("type", packet).Msg("packet")
			transport.api.Notification(NewPacketNotification(packet, from, to, time.Now()))
		}
	}()

	err := <-errChan
	if err != nil {
		connectionLogger.Error().Stack().Err(err).Msg("")
	}
	return err
}

// SendMessage triggers an event to send something to the vehicle. Some messages
// might additional means to pass information around (e.g. file read and write)
func (transport *Transport) SendMessage(message abstraction.TransportMessage) error {
	transport.logger.Info().Type("type", message).Msg("sending")
	switch msg := message.(type) {
	case PacketMessage:
		return transport.handlePacketEvent(msg)
	case FileWriteMessage:
		return transport.handleFileWrite(msg)
	case FileReadMessage:
		return transport.handleFileRead(msg)
	default:
		return ErrUnrecognizedEvent{message.Event()}
	}
}

// handlePacketEvent is used to send an order to one of the connected boards
func (transport *Transport) handlePacketEvent(message PacketMessage) error {
	eventLogger := transport.logger.With().Str("type", fmt.Sprintf("%T", message.Packet)).Uint16("id", uint16(message.Id())).Logger()
	target, ok := transport.idToTarget[message.Id()]
	if !ok {
		eventLogger.Debug().Msg("target not found")
		return ErrUnrecognizedId{Id: message.Id()}
	}
	eventLogger = eventLogger.With().Str("target", string(target)).Logger()
	eventLogger.Info().Msg("sending")

	conn, err := func() (net.Conn, error) {
		transport.connectionsMx.Lock()
		defer transport.connectionsMx.Unlock()
		conn, ok := transport.connections[target]
		if !ok {
			eventLogger.Warn().Msg("target not connected")
			return nil, ErrConnClosed{Target: target}
		}
		return conn, nil
	}()
	if err != nil {
		return err
	}

	data, err := transport.encoder.Encode(message.Packet)
	if err != nil {
		eventLogger.Error().Stack().Err(err).Msg("encode")
		return err
	}

	totalWritten := 0
	for totalWritten < len(data) {
		n, err := conn.Write(data[totalWritten:])
		eventLogger.Trace().Int("amount", n).Msg("written chunk")
		totalWritten += n
		if err != nil {
			eventLogger.Error().Stack().Err(err).Msg("write")
			return err
		}
	}

	eventLogger.Info().Msg("sent")
	return nil
}

// handleFileWrite writes a file through tftp to the blcu
func (transport *Transport) handleFileWrite(message FileWriteMessage) error {
	_, err := transport.tftp.WriteFile(message.Filename(), tftp.BinaryMode, message)
	return err
}

// handleFileRead reads a file through tftp from the blcu
func (transport *Transport) handleFileRead(message FileReadMessage) error {
	_, err := transport.tftp.ReadFile(message.Filename(), tftp.BinaryMode, message)
	return err
}

// HandleSniffer starts listening for packets on the provided sniffer and handles them.
func (transport *Transport) HandleSniffer(sniffer *sniffer.Sniffer) <-chan error {
	demux, errChan := session.NewSnifferDemux(transport.handleConversation, transport.logger)
	demux.ReadPackets(sniffer)
	return errChan
}

// handleConversation is called when the sniffer detects a new conversation and handles its specific packets
func (transport *Transport) handleConversation(socket network.Socket, reader io.Reader) {
	srcAddr := fmt.Sprintf("%s:%d", socket.SrcIP, socket.SrcPort)
	dstAddr := fmt.Sprintf("%s:%d", socket.DstIP, socket.DstPort)
	conversationLogger := transport.logger.With().Str("from", srcAddr).Str("to", dstAddr).Logger()
	go func() {
		for {
			packet, err := transport.decoder.DecodeNext(reader)
			if err != nil {
				conversationLogger.Error().Stack().Err(err).Msg("decode")
				return // TODO: handle error
			}

			transport.api.Notification(NewPacketNotification(packet, srcAddr, dstAddr, time.Now()))
		}
	}()
}

// SetAPI sets the API that the Transport will use
func (transport *Transport) SetAPI(api abstraction.TransportAPI) {
	transport.logger.Trace().Type("api", api).Msg("set api")
	transport.api = api
}
