package logger

import (
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type ErrLoggerNotFound struct {
	Name abstraction.LoggerName
}

func (err ErrLoggerNotFound) Error() string {
	return "Logger " + string(err.Name) + " not found"
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

type ErrLoggerNotRunning struct {
	Name      abstraction.LoggerName
	Timestamp time.Time
}

func (err *ErrLoggerNotRunning) Error() string {
	return "Logger " + string(err.Name) + " not running at " + err.Timestamp.Format(time.RFC3339)
}

type ErrWrongRecordType struct {
	Name      abstraction.LoggerName
	Timestamp time.Time
	Expected  abstraction.LoggerRecord
	Received  abstraction.LoggerRecord
}

func (err *ErrWrongRecordType) Error() string {
	return "Wrong record type for logger " + string(err.Name) + " at " + err.Timestamp.Format(time.RFC3339) + ". Expected " + string(err.Expected.Name()) + " but received " + string(err.Received.Name())
}
