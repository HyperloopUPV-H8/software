package protection

import (
	"fmt"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type ErrUnknownKind struct {
	Kind kind
}

func (err ErrUnknownKind) Error() string {
	return fmt.Sprintf("unrecognized kind %s", err.Kind)
}

type ErrUnknownSeverity struct {
	Id abstraction.PacketId
}

func (err ErrUnknownSeverity) Error() string {
	return fmt.Sprintf("unknown severity for id %d", err.Id)
}
