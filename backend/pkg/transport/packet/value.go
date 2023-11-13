package packet

import "reflect"

// ValueType is the variable type of a data packet value
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

// ValueName is the name of the value
type ValueName string

// ValueDescriptor describes a value of a packet
type ValueDescriptor struct {
	Name ValueName
	Type ValueType
}

// Value is an interface over all kinds of values
type Value interface {
	Type() ValueType
}

// numeric is a helper interface to group any kind of numeric variable
type numeric interface {
	uint8 | uint16 | uint32 | uint64 | int8 | int16 | int32 | int64 | float32 | float64
}

// type assertions to check numeric values follow the Value interface
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

// NumericValue is a value holding a number
type NumericValue[N numeric] struct {
	inner N
}

// NewNumericValue creates a new numeric value
func NewNumericValue[N numeric](val N) NumericValue[N] {
	return NumericValue[N]{
		inner: val,
	}
}

// Value returns the associated number, always as float64
func (value NumericValue[N]) Value() float64 {
	return float64(value.inner)
}

// Type returns the type of the numeric value
func (value NumericValue[N]) Type() ValueType {
	return ValueType(reflect.TypeOf(value.inner).Name())
}

// type assertion to check BooleanValue follows the Value interface
var _ Value = BooleanValue{}

// BooleanValue is a value holding a bool
type BooleanValue struct {
	inner bool
}

// NewBooleanValue creates a new boolean value
func NewBooleanValue(val bool) BooleanValue {
	return BooleanValue{
		inner: val,
	}
}

// Value returns the associated value
func (value BooleanValue) Value() bool {
	return value.inner
}

// Type returns the type of the boolean value
func (value BooleanValue) Type() ValueType {
	return BoolType
}

// EnumVariant is one of the variants an enum can have
type EnumVariant string

// EnumDescriptor describes the possible variants an enum might have
type EnumDescriptor []EnumVariant

// type assertion to check EnumValue follows the Value interface
var _ Value = EnumValue{}

// EnumValue is a value holding the variant of an enum
type EnumValue struct {
	inner EnumVariant
}

// NewEnumValue creates a new enum value
func NewEnumValue(val EnumVariant) EnumValue {
	return EnumValue{
		inner: val,
	}
}

// Variant returns the variant of this value
func (value EnumValue) Variant() EnumVariant {
	return value.inner
}

// Type returns the type of the enum value
func (value EnumValue) Type() ValueType {
	return EnumType
}
