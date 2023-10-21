package transport

import (
	"fmt"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type ErrUnrecognizedEvent struct {
	event abstraction.TransportEvent
}

func (err ErrUnrecognizedEvent) Error() string {
	return fmt.Sprintf("unrecognized event %s", err.event)
}
