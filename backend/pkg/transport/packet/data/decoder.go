package data

import (
	"encoding/binary"
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

// Decoder is a decoder for data packets. It uses the decoder defined on the packet descriptor
type Decoder struct {
	endianness      binary.ByteOrder
	idToDescription map[abstraction.PacketId]Descriptor
}

// Decode decodes the next packet for the given id
//
// the value decoders should be set before calling this method
func (decoder *Decoder) Decode(id abstraction.PacketId, reader io.Reader) (abstraction.Packet, error) {
	descriptor, ok := decoder.idToDescription[id]
	if !ok {
		return nil, ErrUnexpectedId{Id: id}
	}

	packet := NewPacket(id)
	for _, value := range descriptor {
		val, err := value.Decode(decoder.endianness, reader)
		if err != nil {
			return packet, err
		}
		packet.SetValue(value.Name, val)
	}

	return packet, nil
}
