package logger

import (
	"fmt"
	"sync"
	"sync/atomic"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

// Logger is a struct that implements the abstraction.Logger interface
type Logger struct {
	// An atomic boolean is used in order to use CompareAndSwap in the Start and Stop methods
	running        *atomic.Bool
	subloggersLock sync.RWMutex
	subloggers     map[abstraction.LoggerName]abstraction.Logger
}

var _ abstraction.Logger = &Logger{}

func (logger *Logger) Start(startKeys []abstraction.LoggerName) error {
	if logger.running.CompareAndSwap(false, true) {
		fmt.Println("Logger already running")
		return nil
	}

	logger.subloggersLock.Lock()
	defer logger.subloggersLock.Unlock()

	for _, name := range startKeys {
		if sublogger, ok := logger.subloggers[name]; ok {
			go sublogger.Start(nil)
		}
	}

	fmt.Println("Logger started")
	return nil
}

// PushRecord works as a proxy for the PushRecord method of the subloggers
func (logger *Logger) PushRecord(record abstraction.LoggerRecord) error {
	loggerChecked, ok := logger.subloggers[record.Name()]
	if ok {
		loggerChecked.PushRecord(record)
		return nil
	}
	return ErrLoggerNotFound{record.Name()}
}

// PullRecord works as a proxy for the PullRecord method of the subloggers
func (logger *Logger) PullRecord(request abstraction.LoggerRequest) (abstraction.LoggerRecord, error) {
	loggerChecked, ok := logger.subloggers[request.Name()]
	if ok {
		return loggerChecked.PullRecord(request)
	}
	return nil, ErrLoggerNotFound{request.Name()}
}

func (logger *Logger) Stop(stopKeys []abstraction.LoggerName) error {
	logger.subloggersLock.Lock()
	defer logger.subloggersLock.Unlock()

	if !logger.running.CompareAndSwap(true, false) {
		fmt.Printf("Logger already stopped")
		return nil
	}

	var wg sync.WaitGroup
	for _, sublogger := range stopKeys {
		wg.Add(1)

		go func(sublogger abstraction.Logger) {
			defer wg.Done()
			go sublogger.Stop(nil)
		}(logger.subloggers[sublogger])
	}
	// The waitgroup is used in order to wait for all the subloggers to stop
	// before closing the main logger
	wg.Wait()

	fmt.Printf("Logger stopped")
	return nil
}
