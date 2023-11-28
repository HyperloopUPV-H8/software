package transport

import (
	"net"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/tftp"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/presentation"
)

func NewTransport() *Transport {
	return &Transport{
		connections: make(map[abstraction.TransportTarget]net.Conn),
		idToTarget:  make(map[abstraction.PacketId]abstraction.TransportTarget),
	}
}

func (transport *Transport) WithDecoder(decoder *presentation.Decoder) *Transport {
	transport.decoder = decoder
	return transport
}

func (transport *Transport) WithEncoder(encoder *presentation.Encoder) *Transport {
	transport.encoder = encoder
	return transport
}

func (transport *Transport) WithTFTP(client *tftp.Client) *Transport {
	transport.tftp = client
	return transport
}

func (transport *Transport) SetIdTarget(id abstraction.PacketId, target abstraction.TransportTarget) *Transport {
	transport.idToTarget[id] = target
	return transport
}
