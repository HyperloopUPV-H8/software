package logger

import (
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type ErrLoggerNotFound struct {
	name abstraction.LoggerName
}

func (e *ErrLoggerNotFound) Error() string {
	return "Logger not found: " + string(e.name)
}

type ErrCreatingFile struct {
	name      abstraction.LoggerName
	timestamp time.Time
}

func (e *ErrCreatingFile) Error() string {
	return "Error creating file for logger " + string(e.name) + " at " + e.timestamp.Format(time.RFC3339)
}

func NewLoggerNotFoundError(name abstraction.LoggerName) error {
	return &ErrLoggerNotFound{name: name}
}

func NewErrCreatingFile(name abstraction.LoggerName, timestamp time.Time) error {
	return &ErrCreatingFile{name: name, timestamp: timestamp}
}
