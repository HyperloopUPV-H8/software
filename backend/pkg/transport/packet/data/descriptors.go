package data

import (
	"encoding/binary"
	"io"
	"reflect"
)

// Descriptor describes the structure of a data packet as an array of values
type Descriptor []ValueDescriptor

// ValueDescriptor describes a value of a packet
type ValueDescriptor struct {
	Name   ValueName
	Type   valueType
	decode valueDecoder
}

func (descriptor *ValueDescriptor) Decode(endianness binary.ByteOrder, reader io.Reader) (Value, error) {
	return descriptor.decode(endianness, reader)
}

func NewNumericDescriptor[N numeric](name ValueName) ValueDescriptor {
	var n N
	return ValueDescriptor{
		Name:   name,
		Type:   valueType(reflect.TypeOf(n).Name()),
		decode: decodeNumeric[N],
	}
}

func NewBooleanDescriptor(name ValueName) ValueDescriptor {
	return ValueDescriptor{
		Name:   name,
		Type:   BoolType,
		decode: decodeBool,
	}
}

func NewEnumDescriptor(name ValueName, descriptor EnumDescriptor) ValueDescriptor {
	return ValueDescriptor{
		Name:   name,
		Type:   EnumType,
		decode: newDecodeEnum(name, descriptor),
	}
}
