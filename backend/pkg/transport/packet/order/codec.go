package order

import (
	"encoding/binary"
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

func (decoder *Decoder) decodeAdd(id abstraction.PacketId, reader io.Reader) (abstraction.Packet, error) {
	orders, err := decodeSlice[abstraction.PacketId](decoder.endianness, reader)
	return &Add{
		id:     id,
		orders: orders,
	}, err
}

func (decoder *Decoder) decodeRemove(id abstraction.PacketId, reader io.Reader) (abstraction.Packet, error) {
	orders, err := decodeSlice[abstraction.PacketId](decoder.endianness, reader)
	return &Remove{
		id:     id,
		orders: orders,
	}, err
}

type sliceLength uint16

func decodeSlice[T any](endianness binary.ByteOrder, reader io.Reader) ([]T, error) {
	var length sliceLength
	err := binary.Read(reader, endianness, &length)
	if err != nil {
		return nil, err
	}

	slice := make([]T, length)
	err = binary.Read(reader, endianness, &slice)
	return slice, err
}
