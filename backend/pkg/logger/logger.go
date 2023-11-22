package logger

import (
	"fmt"
	"sync"
	"sync/atomic"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

const (
	dataLogger abstraction.LoggerName = "data"
)

type Logger struct {
	running        *atomic.Bool
	subloggersLock sync.RWMutex
	subloggers     map[abstraction.LoggerName]abstraction.Logger
}

func (logger *Logger) Start(startKeys []abstraction.LoggerName) {
	logger.subloggersLock.Lock()
	defer logger.subloggersLock.Unlock()

	if logger.running.CompareAndSwap(false, true) {
		fmt.Println("Logger already running")
		return
	}

	for _, name := range startKeys {
		if sublogger, ok := logger.subloggers[name]; ok {
			go sublogger.Start(nil)
		}
	}

	fmt.Println("Logger started")
}

func (logger *Logger) PushRecord(record abstraction.LoggerRecord) error {
	loggerChecked, ok := logger.subloggers[record.Name()]
	if ok {
		loggerChecked.PushRecord(record)
		return nil
	}
	return ErrLoggerNotFound{record.Name()}
}

func (logger *Logger) PullRecord(request abstraction.LoggerRequest) (abstraction.LoggerRecord, error) {
	loggerChecked, ok := logger.subloggers[request.Name()]
	if ok {
		return loggerChecked.PullRecord(request)
	}
	return nil, ErrLoggerNotFound{request.Name()}
}

func (logger *Logger) Stop(stopKeys []abstraction.LoggerName) {
	logger.subloggersLock.Lock()
	defer logger.subloggersLock.Unlock()

	if !logger.running.CompareAndSwap(true, false) {
		fmt.Printf("Logger already stopped")
		return
	}

	var wg sync.WaitGroup
	for _, sublogger := range stopKeys {
		wg.Add(1)

		go func(sublogger abstraction.Logger) {
			defer wg.Done()
			go sublogger.Stop(nil)
		}(logger.subloggers[sublogger])
	}
	wg.Wait()

	fmt.Printf("Logger stopped")
}
