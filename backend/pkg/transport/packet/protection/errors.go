package protection

import (
	"fmt"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

// ErrUnknownKind is returned when the protection kind is not defined
type ErrUnknownKind struct {
	Kind kind
}

func (err ErrUnknownKind) Error() string {
	return fmt.Sprintf("unrecognized kind %s", err.Kind)
}

// ErrUnknownSeverity is returned when the severity of the protection is unknown
type ErrUnknownSeverity struct {
	Id abstraction.PacketId
}

func (err ErrUnknownSeverity) Error() string {
	return fmt.Sprintf("unknown severity for id %d", err.Id)
}
