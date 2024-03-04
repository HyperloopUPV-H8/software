package presentation

import (
	"encoding/binary"
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/blcu"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/data"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/order"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/protection"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/state"
)

// PacketDecoder is a common interface for packet-specific decoders
type PacketDecoder interface {
	Decode(id abstraction.PacketId, reader io.Reader) (abstraction.Packet, error)
}

// Type assertions to check packet decoders follows the Decoder interface
var _ PacketDecoder = &data.Decoder{}
var _ PacketDecoder = &blcu.Decoder{}
var _ PacketDecoder = &order.Decoder{}
var _ PacketDecoder = &protection.Decoder{}
var _ PacketDecoder = &state.Decoder{}

// Decoder is the root decoder, it takes the id of the packet and decodes the rest of it
type Decoder struct {
	idToDecoder map[abstraction.PacketId]PacketDecoder
	endianness  binary.ByteOrder
}

// TODO: improve constructor
// NewDecoder creates a new decoder with the given endianness
func NewDecoder(endianness binary.ByteOrder) *Decoder {
	return &Decoder{
		idToDecoder: make(map[abstraction.PacketId]PacketDecoder),
		endianness:  endianness,
	}
}

// SetPacketDecoder sets the decoder for the specified id
func (decoder *Decoder) SetPacketDecoder(id abstraction.PacketId, dec PacketDecoder) {
	decoder.idToDecoder[id] = dec
}

// DecodeNext reads and decodes the next packet from the input stream, returning any errors encountered
//
// the decoder should have all the id decoders set before calling DecodeNext
func (decoder *Decoder) DecodeNext(reader io.Reader) (abstraction.Packet, error) {
	var id abstraction.PacketId
	err := binary.Read(reader, decoder.endianness, &id)
	if err != nil {
		return nil, err
	}

	dec, ok := decoder.idToDecoder[id]
	if !ok {
		return nil, ErrUnexpectedId{Id: id}
	}

	packet, err := dec.Decode(id, reader)

	return packet, err
}
