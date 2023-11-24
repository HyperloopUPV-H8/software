package transport

import (
	"errors"
	"net"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/sniffer"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/tcp"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/tftp"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/presentation"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/session"
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

	snifferDemux *session.SnifferDemux

	sniffer     *sniffer.Sniffer
	connections map[abstraction.TransportTarget]net.Conn

	tftp *tftp.Client

	api abstraction.TransportAPI
}

func (transport *Transport) HandleClient(config tcp.ClientConfig, target abstraction.TransportTarget, network, remote string) error {
	for {
		conn, err := config.Dial(network, remote)
		if err != nil {
			if !errors.Is(err, error(tcp.ErrTooManyRetries{})) {
				return err
			}

			continue
		}

		err = transport.handleTCPConn(target, conn)
		if errors.Is(err, error(ErrTargetAlreadyConnected{})) {
			return err
		}

		// Wait before trying to reconnect
		config.CurrentRetries = 5
		time.Sleep(config.Backoff(config.CurrentRetries))
	}
}

func (transport *Transport) HandleServer(config tcp.ServerConfig, network, local string) error {
	return config.Listen(network, local, transport.handleTCPConn)
}

func (transport *Transport) handleTCPConn(target abstraction.TransportTarget, conn net.Conn) error {
	if _, ok := transport.connections[target]; ok {
		conn.Close()
		return ErrTargetAlreadyConnected{Target: target}
	}

	conn, errChan := tcp.WithErrChan(conn)
	defer conn.Close()

	transport.connections[target] = conn
	defer delete(transport.connections, target)

	transport.api.ConnectionUpdate(target, true)
	defer transport.api.ConnectionUpdate(target, false)

	go func() {
		for {
			packet, err := transport.decoder.DecodeNext(conn)
			if err != nil {
				break
			}

			transport.api.Notification(NewPacketNotification(packet))
		}
	}()

	return <-errChan
}

// SendMessage triggers an event to send something to the vehicle. Some messages
// might additional means to pass information around (e.g. file read and write)
func (transport *Transport) SendMessage(message abstraction.TransportMessage) error {
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

func (transport *Transport) handlePacketEvent(message PacketMessage) error {
	panic("TODO!")
}

func (transport *Transport) handleFileWrite(message FileWriteMessage) error {
	panic("TODO!")
}

func (transport *Transport) handleFileRead(message FileReadMessage) error {
	panic("TODO!")
}

// SetAPI sets the API that the Transport will use
func (transport *Transport) SetAPI(api abstraction.TransportAPI) {
	transport.api = api
	// TODO: make decoder use the api Notify method
}
