// # Protection Kinds
// Protections have a kind, which is used to identify what triggered the protection.
// Each kind defines the data carried along with the protection and can be found here:
//
//   - [Below]
//   - [Above]
//   - [OutOfBounds]
//   - [Equals]
//   - [NotEquals]
//   - [ErrorHandler]
//   - [TimeAccumulation]
package protection

import (
	"encoding/binary"
	"io"
)

// Below is a protection that triggers when the data goes below a threshold.
type Below[T valueType] struct {
	Threshold T
	Value     T
}

func decodeBelow[T valueType](reader io.Reader, endianness binary.ByteOrder) (Data, error) {
	packet := new(Below[T])
	err := binary.Read(reader, endianness, packet)
	return packet, err
}

func (Below[T]) Kind() Kind {
	return BelowKind
}

// Above is a protection that triggers when the data goes above a threshold.
type Above[T valueType] struct {
	Threshold T
	Value     T
}

func decodeAbove[T valueType](reader io.Reader, endianness binary.ByteOrder) (Data, error) {
	packet := new(Above[T])
	err := binary.Read(reader, endianness, packet)
	return packet, err
}

func (Above[T]) Kind() Kind {
	return AboveKind
}

// OutOfBounds is a protection that triggers when the data goes out of a range.
type OutOfBounds[T valueType] struct {
	LowerBound T
	UpperBound T
	Value      T
}

func decodeOutOfBounds[T valueType](reader io.Reader, endianness binary.ByteOrder) (Data, error) {
	packet := new(OutOfBounds[T])
	err := binary.Read(reader, endianness, packet)
	return packet, err
}

func (OutOfBounds[T]) Kind() Kind {
	return OutOfBoundsKind
}

// Equals is a protection that triggers when the data is equal to a value.
type Equals[T valueType] struct {
	Target T
	Value  T
}

func decodeEquals[T valueType](reader io.Reader, endianness binary.ByteOrder) (Data, error) {
	packet := new(Equals[T])
	err := binary.Read(reader, endianness, packet)
	return packet, err
}

func (Equals[T]) Kind() Kind {
	return EqualsKind
}

// NotEquals is a protection that triggers when the data is not equal to a value.
type NotEquals[T valueType] struct {
	Target T
	Value  T
}

func decodeNotEquals[T valueType](reader io.Reader, endianness binary.ByteOrder) (Data, error) {
	packet := new(NotEquals[T])
	err := binary.Read(reader, endianness, packet)
	return packet, err
}

func (NotEquals[T]) Kind() Kind {
	return NotEqualsKind
}

// ErrorHandler is a protection that triggers when an error occurs.
type ErrorHandler struct {
	Error string
}

func decodeErrorHandler(reader io.Reader, endianness binary.ByteOrder) (Data, error) {
	packet := new(ErrorHandler)
	var err error
	packet.Error, err = readCString(reader)
	return packet, err
}

func (ErrorHandler) Kind() Kind {
	return ErrorHandlerKind
}

// TimeAccumulation is a protection that triggers when the data over a period of time is too big.
//
// The time is specified in seconds and the frequency of measurements is specified in Hz.
type TimeAccumulation[T valueType] struct {
	Threshold T
	Value     T
	Time      float32
	Frequency float32
}

func decodeTimeAccumulation[T valueType](reader io.Reader, endianness binary.ByteOrder) (Data, error) {
	packet := new(TimeAccumulation[T])
	err := binary.Read(reader, endianness, packet)
	return packet, err
}

func (TimeAccumulation[T]) Kind() Kind {
	return TimeAccumulationKind
}
