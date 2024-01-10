package protection

import (
	"encoding/binary"
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type Format uint8
type Bound uint8
type Severity string

const (
	IntFormat Format = iota
	FloatFormat
	DoubleFormat
	CharFormat
	BoolFormat
	ShortFormat
	LongFormat
	Uint8Format
	Uint16Format
	Uint32Format
	Uint64Format
	Int8Format
)
const (
	BelowBound Bound = iota
	AboveBound
	OutOfBoundsBound
	EqualsBound
	NotEqualsBound
	ErrorHandlerBound
	TimeAccumulationBound
)

const (
	WarningSeverity Severity = "warning"
	FaultSeverity   Severity = "fault"
)

type Packet struct {
	id        abstraction.PacketId
	formatId  Format
	boundType Bound
	name      string
	data      data
	timestamp Timestamp
}

func NewPacket(id abstraction.PacketId) *Packet {
	return &Packet{
		id:        id,
		timestamp: Timestamp{},
	}
}

func (packet *Packet) Id() abstraction.PacketId {
	return packet.id
}

type Fault Packet

func (fault *Fault) Severity() Severity {
	return FaultSeverity
}

func (fault *Fault) Id() abstraction.PacketId {
	return fault.id
}

type Warning Packet

func (warning *Warning) Severity() Severity {
	return WarningSeverity
}

func (warning *Warning) Id() abstraction.PacketId {
	return warning.id
}

type data interface {
	Decode(endianness binary.ByteOrder, reader io.Reader) error
	Type() Bound
}

var _ data = &Below[any]{}
var _ data = &Above[any]{}
var _ data = &Equals[any]{}
var _ data = &NotEquals[any]{}
var _ data = &OutOfBounds[any]{}
var _ data = &ErrorHandler{}
var _ data = &TimeAccumulation[any]{}

type Below[T any] struct {
	Bound T
	Value T
}

func newBelow[T any]() data {
	return &Below[T]{}
}

func (protection *Below[T]) Decode(endianness binary.ByteOrder, reader io.Reader) error {
	return binary.Read(reader, endianness, protection)
}

func (protection *Below[T]) Type() Bound {
	return BelowBound
}

type Above[T any] struct {
	Bound T
	Value T
}

func newAbove[T any]() data {
	return &Above[T]{}
}

func (protection *Above[T]) Decode(endianness binary.ByteOrder, reader io.Reader) error {
	return binary.Read(reader, endianness, protection)
}

func (protection *Above[T]) Type() Bound {
	return AboveBound
}

type Equals[T any] struct {
	Bound T
	Value T
}

func newEquals[T any]() data {
	return &Equals[T]{}
}

func (protection *Equals[T]) Decode(endianness binary.ByteOrder, reader io.Reader) error {
	return binary.Read(reader, endianness, protection)
}

func (protection *Equals[T]) Type() Bound {
	return EqualsBound
}

func newNotEquals[T any]() data {
	return &NotEquals[T]{}
}

type NotEquals[T any] struct {
	Bound T
	Value T
}

func (protection *NotEquals[T]) Decode(endianness binary.ByteOrder, reader io.Reader) error {
	return binary.Read(reader, endianness, protection)
}

func (protection *NotEquals[T]) Type() Bound {
	return NotEqualsBound
}

type OutOfBounds[T any] struct {
	LowerBound T
	UpperBound T
	Value      T
}

func newOutOfBounds[T any]() data {
	return &OutOfBounds[T]{}
}

func (protection *OutOfBounds[T]) Decode(endianness binary.ByteOrder, reader io.Reader) error {
	return binary.Read(reader, endianness, protection)
}

func (protection *OutOfBounds[T]) Type() Bound {
	return OutOfBoundsBound
}

type ErrorHandler struct {
	Value string
}

func newErrorHandler() data {
	return &ErrorHandler{}
}

func (protection *ErrorHandler) Decode(endianness binary.ByteOrder, reader io.Reader) (err error) {
	protection.Value, err = readCString(reader)
	return err
}

func (protection *ErrorHandler) Type() Bound {
	return ErrorHandlerBound
}

type TimeAccumulation[T any] struct {
	Bound     T
	Value     T
	TimeLimit float32
	Frequency float32
}

func newTimeAccumulation[T any]() data {
	return &TimeAccumulation[T]{}
}

func (protection *TimeAccumulation[T]) Decode(endianness binary.ByteOrder, reader io.Reader) error {
	return binary.Read(reader, endianness, protection)
}

func (protection *TimeAccumulation[T]) Type() Bound {
	return TimeAccumulationBound
}

type Timestamp struct {
	Counter uint16
	Second  uint8
	Minute  uint8
	Hour    uint8
	Day     uint8
	Month   uint8
	Year    uint16
}

func (timestamp *Timestamp) Decode(endianness binary.ByteOrder, reader io.Reader) error {
	return binary.Read(reader, endianness, timestamp)
}
