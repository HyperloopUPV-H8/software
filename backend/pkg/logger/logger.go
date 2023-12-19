package logger

import (
	"encoding/json"
	"fmt"
	"sync"
	"sync/atomic"

	wsModels "github.com/HyperloopUPV-H8/h9-backend/internal/ws_handle/models"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

const (
	HandlerName = "logger"
)

// Logger is a struct that implements the abstraction.Logger interface
type Logger struct {
	// An atomic boolean is used in order to use CompareAndSwap in the Start and Stop methods
	running        *atomic.Bool
	subloggersLock *sync.RWMutex
	// The subloggers are only the loggers selected at the start of the log
	subloggers map[abstraction.LoggerName]abstraction.Logger
}

var _ abstraction.Logger = &Logger{}

func (*Logger) HandlerName() string {
	return HandlerName
}

func (logger *Logger) UpdateMessage(client wsModels.Client, message wsModels.Message) {
	var enable bool
	err := json.Unmarshal(message.Payload, &enable)
	if err != nil {
		logger.Stop()
		fmt.Printf("Error unmarshalling enable message")
		return
	} else {
		if enable {
			logger.Start()
		} else {
			logger.Stop()
		}
	}
}

func NewLogger(keys map[abstraction.LoggerName]abstraction.Logger) *Logger {
	return &Logger{
		running:        &atomic.Bool{},
		subloggersLock: &sync.RWMutex{},
		subloggers:     keys,
	}
}

func (logger *Logger) Start() error {
	if logger.running.CompareAndSwap(false, true) {
		fmt.Println("Logger already running")
		return nil
	}

	for _, key := range logger.subloggers {
		go key.Start()
	}

	logger.subloggersLock.Lock()
	defer logger.subloggersLock.Unlock()

	fmt.Println("Logger started")
	return nil
}

// PushRecord works as a proxy for the PushRecord method of the subloggers
func (logger *Logger) PushRecord(record abstraction.LoggerRecord) error {
	objectiveLogger := record.Name()

	for name, logger := range logger.subloggers {
		if name == objectiveLogger {
			logger.PushRecord(record)
			return nil
		} else {
			return ErrLoggerNotFound{objectiveLogger}
		}
	}

	return ErrParsingLoggerMap{objectiveLogger}
}

// PullRecord works as a proxy for the PullRecord method of the subloggers
func (logger *Logger) PullRecord(request abstraction.LoggerRequest) (abstraction.LoggerRecord, error) {
	loggerChecked, ok := logger.subloggers[request.Name()]
	if !ok {
		return nil, ErrLoggerNotFound{request.Name()}
	}
	return loggerChecked.PullRecord(request)
}

func (logger *Logger) Stop() error {
	logger.subloggersLock.Lock()
	defer logger.subloggersLock.Unlock()

	if !logger.running.CompareAndSwap(true, false) {
		fmt.Printf("Logger already stopped")
		return nil
	}

	// The waitgroup is used in order to wait for all the subloggers to stop
	// before closing the main logger
	var wg sync.WaitGroup
	for name := range logger.subloggers {
		wg.Add(1)

		go func(sublogger abstraction.Logger) {
			defer wg.Done()
			sublogger.Stop()
		}(logger.subloggers[name])
	}
	wg.Wait()

	fmt.Printf("Logger stopped")
	return nil
}
