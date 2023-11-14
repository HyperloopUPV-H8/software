package state

import (
	"encoding/binary"
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type Decoder struct {
	endianness binary.ByteOrder
}

func (decoder *Decoder) Decode(id abstraction.PacketId, reader io.Reader) (abstraction.Packet, error) {
	stateSpace := Space{
		id: id,
	}

	err := binary.Read(reader, decoder.endianness, &stateSpace.state)
	return &stateSpace, err
}
