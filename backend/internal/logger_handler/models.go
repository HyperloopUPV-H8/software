package logger_handler

import "github.com/HyperloopUPV-H8/h9-backend/internal/common"

type Logger interface {
	Ids() common.Set[string]
	Start(basePath string) chan<- Loggable
}

type ActiveLogger struct {
	Ids   common.Set[string]
	Input chan<- Loggable
}

type Loggable interface {
	Id() string
	Log() []string
}
