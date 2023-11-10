package decoder

import (
	"encoding/binary"
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/presentation"
)

type valueDecoder func(name packet.ValueName, endianness binary.ByteOrder, reader io.Reader) (packet.Value, error)

type Data struct {
	endianness       binary.ByteOrder
	idToDescription  map[abstraction.PacketId]packet.DataDescriptor
	enumDescriptions map[packet.ValueName]packet.EnumDescriptor
	valueDecoders    map[packet.ValueType]valueDecoder
}

func (decoder *Data) Decode(id abstraction.PacketId, reader io.Reader) (abstraction.Packet, error) {
	descriptor, ok := decoder.idToDescription[id]
	if !ok {
		return nil, presentation.ErrUnexpectedId{Id: id}
	}

	packet := packet.NewData(id)
	for _, value := range descriptor {
		dec, ok := decoder.valueDecoders[value.Type]
		if !ok {
			return packet, presentation.ErrUnexpectedValue{Value: value}
		}

		val, err := dec(value.Name, decoder.endianness, reader)
		if err != nil {
			return packet, err
		}
		packet.SetValue(value.Name, val)
	}

	return packet, nil
}

type numeric interface {
	uint8 | uint16 | uint32 | uint64 | int8 | int16 | int32 | int64 | float32 | float64
}

var _ valueDecoder = decodeNumeric[uint8]
var _ valueDecoder = decodeNumeric[uint16]
var _ valueDecoder = decodeNumeric[uint32]
var _ valueDecoder = decodeNumeric[uint64]
var _ valueDecoder = decodeNumeric[int8]
var _ valueDecoder = decodeNumeric[int16]
var _ valueDecoder = decodeNumeric[int32]
var _ valueDecoder = decodeNumeric[int64]
var _ valueDecoder = decodeNumeric[float32]
var _ valueDecoder = decodeNumeric[float64]

func decodeNumeric[N numeric](name packet.ValueName, endianness binary.ByteOrder, reader io.Reader) (packet.Value, error) {
	var val N
	err := binary.Read(reader, endianness, &val)
	return packet.NewNumericValue[N](val), err
}

var _ valueDecoder = decodeBool

func decodeBool(name packet.ValueName, endianness binary.ByteOrder, reader io.Reader) (packet.Value, error) {
	var val bool
	err := binary.Read(reader, endianness, &val)
	return packet.NewBooleanValue(val), err
}

var _ valueDecoder = (&Data{}).decodeEnum

func (decoder *Data) decodeEnum(name packet.ValueName, endianness binary.ByteOrder, reader io.Reader) (packet.Value, error) {
	enum, ok := decoder.enumDescriptions[name]
	if !ok {
		return nil, presentation.ErrUndefinedEnum{Name: name}
	}

	var val uint8
	err := binary.Read(reader, endianness, &val)
	if err != nil {
		return nil, err
	}
	idx := int(val)

	if idx >= len(enum) {
		return nil, presentation.ErrInvalidVariant{Idx: idx, Len: len(enum)}
	}

	return packet.NewEnumValue(enum[idx]), nil

}
