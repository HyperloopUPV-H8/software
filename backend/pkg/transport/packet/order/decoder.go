package order

import (
	"encoding/binary"
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

// actionDecoder is a decoder for a stateOrder action
type actionDecoder func(id abstraction.PacketId, reader io.Reader) (abstraction.Packet, error)

// Decoder decodes the state order actions
type Decoder struct {
	idToAction map[abstraction.PacketId]actionDecoder
	endianness binary.ByteOrder
}

// Decode decodes the next state order action from the reader.
//
// it uses the id to determine the kind of action.
func (decoder *Decoder) Decode(id abstraction.PacketId, reader io.Reader) (abstraction.Packet, error) {
	dec, ok := decoder.idToAction[id]
	if !ok {
		return nil, ErrUnexpectedId{Id: id}
	}

	return dec(id, reader)
}
