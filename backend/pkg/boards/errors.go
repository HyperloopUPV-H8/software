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

type ErrReadingFileFailed struct {
	Filename  string
	Timestamp time.Time
	Inner     error
}

func (err ErrReadingFileFailed) Error() {
	fmt.Sprintf("Invalid board id %s at %s", err.Filename, err.Timestamp.Format(time.RFC3339))
}

type ErrSendMessageFailed struct {
	Timestamp time.Time
	Inner     error
}

func (err ErrSendMessageFailed) Error() {
	fmt.Sprintf("Error sending message at %s", err.Timestamp.Format(time.RFC3339))
}