package logger

import (
	"fmt"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type ErrLoggerNotFound struct {
	Name abstraction.LoggerName
}

func (err ErrLoggerNotFound) Error() string {
	return fmt.Sprintf("Logger %s not found", err.Name)
}

type ErrCreatingFile struct {
	Name      abstraction.LoggerName
	Timestamp time.Time
	Inner     error
}

func (err *ErrCreatingFile) Error() string {
	return fmt.Sprintf("Error creating file for %s logger at %s", err.Name, err.Timestamp.Format(time.RFC3339))
}

func (err *ErrCreatingFile) Unwrap() error {
	return err.Inner
}

type ErrLoggerNotRunning struct {
	Name      abstraction.LoggerName
	Timestamp time.Time
}

func (err *ErrLoggerNotRunning) Error() string {
	return fmt.Sprintf("Logger %s not running at %s", err.Name, err.Timestamp.Format(time.RFC3339))
}

type ErrWrongRecordType struct {
	Name      abstraction.LoggerName
	Timestamp time.Time
	Expected  abstraction.LoggerRecord
	Received  abstraction.LoggerRecord
}

func (err *ErrWrongRecordType) Error() string {
	return fmt.Sprintf("Wrong record type for logger %s at %s, expected %T, got %T", err.Name, err.Timestamp.Format(time.RFC3339), err.Expected.Name(), err.Received.Name())
}
