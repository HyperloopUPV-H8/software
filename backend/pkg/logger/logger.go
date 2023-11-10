/*
v0.2.0
The logger package is responsible for logging the data received from the
pod and also for reaching that data later on

As of 2023-11-08 the logger is equiped with the main functions and is ready
to be used. However, the logger is not yet integrated with the rest of the
system.
*/
package logger

import (
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger/data"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger/msg"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger/ord"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger/state"
)

type LoggerName string

type DataL struct {
	Timestamp string
	Data      string
	Logger    LoggerName
}

func (dl *DataL) Name() LoggerName {
	return dl.Logger
}

type DataR struct {
	Timestamp time.Time
	Data      string
	Logger    LoggerName
}

func (dr *DataR) Name() LoggerName {
	return dr.Logger
}

type LoggerFunc func(record interface{}) error
type RequestFunc func(request interface{}) (interface{}, error)

type Logger interface {
	PushRecord(interface{}) error
	PullRecord(interface{}) (interface{}, error)
}

type BaseLogger struct {
	logFuncs     map[LoggerName]LoggerFunc
	requestFuncs map[LoggerName]RequestFunc
}

func NewBaseLogger() *BaseLogger {
	return &BaseLogger{
		logFuncs: map[LoggerName]LoggerFunc{
			"datalogger":  data.DataLog,
			"msglogger":   msg.MsgLog,
			"ordlogger":   ord.OrdLog,
			"statelogger": state.StateLog,
		},
		requestFuncs: map[LoggerName]RequestFunc{
			"datalogger":  data.DataRequest,
			"msglogger":   msg.MsgRequest,
			"ordlogger":   ord.OrdRequest,
			"statelogger": state.StateRequest,
		},
	}
}
