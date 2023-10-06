package vehicle

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type BoardEvent string
type BoardNotification interface {
	Event() BoardEvent
}

type BoardId uint16
type Board interface {
	Id() BoardId
	Notify(BoardNotification)
}

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
	boards    map[BoardId]Board
	transport abstraction.Transport
	logger    Logger
}
