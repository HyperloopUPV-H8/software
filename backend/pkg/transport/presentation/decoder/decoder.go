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

type packetCallback = func(abstraction.Packet)

type PacketDecoder struct {
	idToDecoder map[abstraction.PacketId]Decoder
	onPacket    packetCallback
	endianness  binary.ByteOrder
}

func (decoder *PacketDecoder) DecodeFrom(reader io.Reader) error {
	var id abstraction.PacketId
	idBuf := make([]byte, binary.Size(id))
	n, err := reader.Read(idBuf)
	if n < 2 {
		return io.ErrUnexpectedEOF
	}

	id = abstraction.PacketId(decoder.endianness.Uint16(idBuf[:n]))

	if err != nil {
		return err
	}

	dec, ok := decoder.idToDecoder[id]
	if !ok {
		return presentation.ErrUnexpectedId{Id: id}
	}

	packet, err := dec.Decode(id, reader)
	if err != nil {
		return err
	}

	decoder.onPacket(packet)
	return nil
}
