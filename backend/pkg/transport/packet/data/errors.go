package data

import (
	"fmt"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

// ErrUnexpectedId is returned when an ID is not recognized or is not defined
type ErrUnexpectedId struct {
	Id abstraction.PacketId
}

func (err ErrUnexpectedId) Error() string {
	return fmt.Sprintf("unexpected id %d", err.Id)
}

// ErrUnexpectedValue is returned when a codec is not found for a value
type ErrUnexpectedValue struct {
	Value valueDescriptor
}

func (err ErrUnexpectedValue) Error() string {
	return fmt.Sprintf("unexpected value %s with type %s", err.Value.Name, err.Value.Type)
}

// ErrUndefinedEnum is returned when an enum is not defined
type ErrUndefinedEnum struct {
	Name ValueName
}

func (err ErrUndefinedEnum) Error() string {
	return fmt.Sprintf("enum %s is not defined", err.Name)
}

// ErrInvalidVariant is returned when trying to access an invalid enum variant
type ErrInvalidVariant struct {
	Name ValueName
	Idx  int
	Len  int
}

func (err ErrInvalidVariant) Error() string {
	return fmt.Sprintf("enum %s has %d variants, but tried to access the %d variant", err.Name, err.Len, err.Idx+1)
}
