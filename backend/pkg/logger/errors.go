package logger

import (
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type ErrLoggerNotFound struct {
	Name abstraction.LoggerName
}

func (e ErrLoggerNotFound) Error() string {
	return "Logger not found: " + string(e.Name)
}

type ErrCreatingFile struct {
	Name      abstraction.LoggerName
	Timestamp time.Time
	Inner     error
}

func (err *ErrCreatingFile) Error() string {
	return "Error creating file for logger " + string(err.Name) + " at " + err.Timestamp.Format(time.RFC3339)
}

func (err *ErrCreatingFile) Unwrap() error {
	return err.Inner
}
