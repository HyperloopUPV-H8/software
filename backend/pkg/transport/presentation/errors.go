package presentation

import (
	"fmt"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet"
)

type ErrUnexpectedId struct {
	Id abstraction.PacketId
}

func (err ErrUnexpectedId) Error() string {
	return fmt.Sprintf("unexpected id %d", err.Id)
}

type ErrUnexpectedValue struct {
	Value packet.ValueDescriptor
}

func (err ErrUnexpectedValue) Error() string {
	return fmt.Sprintf("unexpected value %s with type %s", err.Value.Name, err.Value.Type)
}

type ErrUndefinedEnum struct {
	Name packet.ValueName
}

func (err ErrUndefinedEnum) Error() string {
	return fmt.Sprintf("enum %s is not defined", err.Name)
}

type ErrInvalidVariant struct {
	Name packet.ValueName
	Idx  int
	Len  int
}

func (err ErrInvalidVariant) Error() string {
	return fmt.Sprintf("enum %s has %d variants, but tried to access the %d variant", err.Name, err.Len, err.Idx+1)
}
