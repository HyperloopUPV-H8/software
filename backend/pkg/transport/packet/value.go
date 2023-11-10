package packet

import "reflect"

type ValueType string

const (
	Uint8Type   ValueType = "uint8"
	Uint16Type  ValueType = "uint16"
	Uint32Type  ValueType = "uint32"
	Uint64Type  ValueType = "uint64"
	Int8Type    ValueType = "int8"
	Int16Type   ValueType = "int16"
	Int32Type   ValueType = "int32"
	Int64Type   ValueType = "int64"
	Float32Type ValueType = "float32"
	Float64Type ValueType = "float64"
	BoolType    ValueType = "bool"
	EnumType    ValueType = "enum"
)

type ValueName string

type ValueDescriptor struct {
	Name ValueName
	Type ValueType
}

type Value interface {
	Type() ValueType
}

// Maybe this is not the best place to put this in
type numeric interface {
	uint8 | uint16 | uint32 | uint64 | int8 | int16 | int32 | int64 | float32 | float64
}

var _ Value = NumericValue[uint8]{}
var _ Value = NumericValue[uint16]{}
var _ Value = NumericValue[uint32]{}
var _ Value = NumericValue[uint64]{}
var _ Value = NumericValue[int8]{}
var _ Value = NumericValue[int16]{}
var _ Value = NumericValue[int32]{}
var _ Value = NumericValue[int64]{}
var _ Value = NumericValue[float32]{}
var _ Value = NumericValue[float64]{}

type NumericValue[N numeric] struct {
	inner N
}

func NewNumericValue[N numeric](val N) NumericValue[N] {
	return NumericValue[N]{
		inner: val,
	}
}

func (value NumericValue[N]) Value() float64 {
	return float64(value.inner)
}

func (value NumericValue[N]) Type() ValueType {
	return ValueType(reflect.TypeOf(value.inner).Name())
}

var _ Value = BooleanValue{}

type BooleanValue struct {
	inner bool
}

func NewBooleanValue(val bool) BooleanValue {
	return BooleanValue{
		inner: val,
	}
}

func (value BooleanValue) Value() bool {
	return value.inner
}

func (value BooleanValue) Type() ValueType {
	return BoolType
}

type EnumVariant string

type EnumDescriptor []EnumVariant

var _ Value = EnumValue{}

type EnumValue struct {
	inner EnumVariant
}

func NewEnumValue(val EnumVariant) EnumValue {
	return EnumValue{
		inner: val,
	}
}

func (value EnumValue) Variant() EnumVariant {
	return value.inner
}

func (value EnumValue) Type() ValueType {
	return EnumType
}
