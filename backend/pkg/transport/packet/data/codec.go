package data

import (
	"encoding/binary"
	"io"
)

// valueDecoder is a function that tells how a value should be decoded based on its type
type valueDecoder func(endianness binary.ByteOrder, reader io.Reader) (Value, error)

// type assertions to check all variants of decodeNumeric are valueDecoders
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

// decodeNumeric decodes the next numeric value based on the provided type
func decodeNumeric[N numeric](endianness binary.ByteOrder, reader io.Reader) (Value, error) {
	var val N
	err := binary.Read(reader, endianness, &val)
	return NewNumericValue[N](val), err
}

// type assertion to check decodeBool follows valueDecoder
var _ valueDecoder = decodeBool

// decodeBool decodes the next boolean value
func decodeBool(endianness binary.ByteOrder, reader io.Reader) (Value, error) {
	var val bool
	err := binary.Read(reader, endianness, &val)
	return NewBooleanValue(val), err
}

// newDecodeEnum creates a new enum decoder for the given EnumDescriptor and name
func newDecodeEnum(name ValueName, descriptor EnumDescriptor) valueDecoder {
	return func(endianness binary.ByteOrder, reader io.Reader) (Value, error) {
		var variant uint8
		err := binary.Read(reader, endianness, &variant)
		if err != nil {
			return nil, err
		}
		variantIdx := int(variant)

		if variantIdx >= len(descriptor) {
			return nil, ErrInvalidVariant{Name: name, Idx: variantIdx, Len: len(descriptor)}
		}

		return NewEnumValue(descriptor[variantIdx]), nil
	}
}
