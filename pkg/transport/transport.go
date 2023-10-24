package transport

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/sniffer"
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
	decoder *presentation.PacketDecoder
	encoder *presentation.PacketEncoder

	conversations map[network.Socket]*session.SocketBuffer

	sniffer *sniffer.Sniffer
	boards  map[abstraction.BoardId]*network.TCPConn

	tftp *network.TFTPConn

	api abstraction.TransportAPI
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
