package transport

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/presentation"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/session"
)

type Transport struct {
	decoder *presentation.PacketDecoder
	encoder *presentation.PacketEncoder

	conversations map[network.Socket]*session.SocketBuffer

	sniffer *network.Sniffer
	boards  map[abstraction.BoardId]*network.TCPConn

	tftp *network.TFTPConn

	api abstraction.TransportAPI
}

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

func (transport *Transport) SetAPI(api abstraction.TransportAPI) {
	transport.api = api
	// TODO: make decoder use the api Notify method
}
