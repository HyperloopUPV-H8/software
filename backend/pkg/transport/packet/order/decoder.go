package order

import (
	"encoding/binary"
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type actionDecoder func(id abstraction.PacketId, reader io.Reader) (abstraction.Packet, error)

type Decoder struct {
	idToAction map[abstraction.PacketId]actionDecoder
	endianness binary.ByteOrder
}

func (decoder *Decoder) Decode(id abstraction.PacketId, reader io.Reader) (abstraction.Packet, error) {
	dec, ok := decoder.idToAction[id]
	if !ok {
		return nil, ErrUnexpectedId{Id: id}
	}

	return dec(id, reader)
}
