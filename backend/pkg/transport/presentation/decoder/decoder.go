package decoder

import (
	"encoding/binary"
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/presentation"
)

type Decoder interface {
	Decode(id abstraction.PacketId, reader io.Reader) (abstraction.Packet, error)
}

type PacketDecoder struct {
	idToDecoder map[abstraction.PacketId]Decoder
	endianness  binary.ByteOrder
}

func (decoder *PacketDecoder) DecodeNext(reader io.Reader) (abstraction.Packet, error) {
	var id abstraction.PacketId
	err := binary.Read(reader, decoder.endianness, &id)
	if err != nil {
		return nil, err
	}

	dec, ok := decoder.idToDecoder[id]
	if !ok {
		return nil, presentation.ErrUnexpectedId{Id: id}
	}

	packet, err := dec.Decode(id, reader)

	return packet, err
}
