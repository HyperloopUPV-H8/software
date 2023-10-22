package transport

import (
	"fmt"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

// ErrUnrecognizedEvent is returned when the event passed to transport
// has an invalid type or it is not recognized.
type ErrUnrecognizedEvent struct {
	event abstraction.TransportEvent
}

func (err ErrUnrecognizedEvent) Error() string {
	return fmt.Sprintf("unrecognized event %s", err.event)
}
