package logger

import (
	"fmt"
	"sync"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

const (
	dataLogger abstraction.LoggerName = "data"
)

type Logger struct {
	running    bool
	lock       sync.Mutex
	subloggers map[abstraction.LoggerName]abstraction.Logger
}

func (logger *Logger) Start(startKeys []abstraction.LoggerName) {
	logger.lock.Lock()
	defer logger.lock.Unlock()

	if logger.running {
		fmt.Printf("Logger already running")
		return
	}

	for _, name := range startKeys {
		if sublogger, ok := logger.subloggers[name]; ok {
			go sublogger.Start()
		}
	}

	logger.running = true
	fmt.Printf("Logger started")
}

func (logger *Logger) PushRecord(record abstraction.LoggerRecord) error {
	loggerChecked, exists := logger.subloggers[record.Name()]
	if exists {
		loggerChecked.PushRecord(record)
		return nil
	}
	return NewLoggerNotFoundError(record.Name())
}

// Same as upper but with a pull
func (logger *Logger) PullRecord(request abstraction.LoggerRequest) (abstraction.LoggerRecord, error) {
	loggerChecked, exists := logger.subloggers[request.Name()]
	if exists {
		return loggerChecked.PullRecord(request)
	}
	return nil, NewLoggerNotFoundError(request.Name())
}

func (logger *Logger) Stop(stopKeys []abstraction.LoggerName) {
	logger.lock.Lock()
	defer logger.lock.Unlock()

	if !logger.running {
		fmt.Printf("Logger already stopped")
		return
	}

	var wg sync.WaitGroup
	for _, sublogger := range stopKeys {
		wg.Add(1)

		go func(sublogger abstraction.Logger) {
			defer wg.Done()
			go sublogger.Stop()
		}(logger.subloggers[sublogger])
	}
	wg.Wait()

	logger.running = false
	fmt.Printf("Logger stopped")
}
