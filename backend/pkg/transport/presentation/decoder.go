package presentation

import (
	"encoding/binary"
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/data"
)

// Decoder is a common interface for packet-specific decoders
type Decoder interface {
	Decode(id abstraction.PacketId, reader io.Reader) (abstraction.Packet, error)
}

// Type assertion to check data follows the Decoder interface
var _ Decoder = &data.Decoder{}

// Packet is the root decoder, it takes the id of the packet and decodes the rest of it
type Packet struct {
	idToDecoder map[abstraction.PacketId]Decoder
	endianness  binary.ByteOrder
}

// DecodeNext reads and decodes the next packet from the input stream, returning any errors encountered
func (decoder *Packet) DecodeNext(reader io.Reader) (abstraction.Packet, error) {
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
