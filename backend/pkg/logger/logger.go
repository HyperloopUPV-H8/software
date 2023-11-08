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
	"errors"
	"time"
)

type LoggerName string

type DataRecord struct {
	Timestamp time.Time
	Data      string
	logger    LoggerName
}

func (dr *DataRecord) Name() LoggerName {
	return dr.logger
}

type DataRequest struct {
	Timestamp time.Time
	Data      string
	logger    LoggerName
}

func (dr *DataRequest) Name() LoggerName {
	return dr.logger
}

type LoggerFunc func(*DataRecord) error
type RequestFunc func(*DataRequest) (*DataRecord, error)

type Logger interface {
	PushRecord(*DataRecord) error
	PullRecord(*DataRequest) (*DataRecord, error)
}

type BaseLogger struct {
	logFuncs     map[LoggerName]LoggerFunc
	requestFuncs map[LoggerName]RequestFunc
}

func NewBaseLogger() *BaseLogger {
	return &BaseLogger{
		logFuncs: map[LoggerName]LoggerFunc{
			"datalogger": DataLog,
			"msglogger":  MsgLog,
			"ordlogger":  OrdLog,
			"suslogger":  SusLog,
		},
		requestFuncs: map[LoggerName]RequestFunc{
			"datalogger": DataRequest,
			"msglogger":  MsgRequest,
			"ordlogger":  OrdRequest,
			"suslogger":  SusRequest,
		},
	}
}

func (bl *BaseLogger) PushRecord(record *DataRecord) error {
	if logFunc, ok := bl.logFuncs[record.Name()]; ok {
		return logFunc(record)
	}
	return errors.New("unknown logger name")
}

func (bl *BaseLogger) PullRecord(request *DataRequest) (*DataRecord, error) {
	if requestFunc, ok := bl.requestFuncs[request.Name()]; ok {
		return requestFunc(request)
	}
	return nil, errors.New("unknown logger name")
}
