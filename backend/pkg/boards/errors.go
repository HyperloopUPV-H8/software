package boards

import (
	"fmt"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"time"
)

type ErrNewClientFailed struct {
	Addr      string
	Timestamp time.Time
	Inner     error
}

func (err ErrNewClientFailed) Error() {
	fmt.Sprintf("Error creating new client at %s", err.Timestamp.Format(time.RFC3339))
}

type ErrInvalidBoardEvent struct {
	Event     abstraction.BoardEvent
	Timestamp time.Time
}

func (err ErrInvalidBoardEvent) Error() {
	fmt.Sprintf("Invalid board event %s at %s", err.Event, err.Timestamp.Format(time.RFC3339))
}
