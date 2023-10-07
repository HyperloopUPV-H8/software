package vehicle

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type LoggerName string
type LoggerRecord interface {
	Name() LoggerName
}
type LoggerRequest interface {
	Name() LoggerName
}

type Logger interface {
	PushRecord(LoggerRecord) error
	PullRecord(LoggerRequest) (LoggerRecord, error)
}

type Vehicle struct {
	broker    abstraction.Broker
	boards    map[abstraction.BoardId]abstraction.Board
	transport abstraction.Transport
	logger    Logger
}
