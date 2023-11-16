package logger

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type ErrLoggerNotFound struct {
	name abstraction.LoggerName
}

func (e *ErrLoggerNotFound) Error() string {
	return "Logger not found: " + string(e.name)
}

func NewLoggerNotFoundError(name abstraction.LoggerName) error {
	return &ErrLoggerNotFound{name: name}
}
