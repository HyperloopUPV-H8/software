package logger

import (
	"errors"
	"fmt"
	"sync"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type Logger struct {
	running      bool
	lock         sync.Mutex
	subloggerMap map[abstraction.LoggerName]abstraction.Logger
}

func (logger *Logger) Start(startKeys []abstraction.LoggerName) {
	logger.lock.Lock()
	defer logger.lock.Unlock()

	if logger.running {
		fmt.Printf("Logger already running")
		return
	}

	for reference, sublogger := range logger.subloggerMap {
		for _, name := range startKeys {
			if reference == name {
				go sublogger.Start()
			}
		}

		logger.running = true
		fmt.Printf("Logger started")
	}
}

func (logger *Logger) PushRecord(record abstraction.LoggerRecord) error {
	if logger.running {
		logger.subloggerMap[record.Name()].PushRecord(record)
		return nil
	}
	return errors.New("Logger not running")
}

// Same as upper but with a pull
func (logger *Logger) PullRecord(request abstraction.LoggerRequest) (abstraction.LoggerRecord, error) {
	if logger.running {
		return logger.subloggerMap[request.Name()].PullRecord(request)
	}
	return nil, errors.New("Logger not running")
}

func (logger *Logger) Stop(stopKeys []abstraction.LoggerName) {
	logger.lock.Lock()
	defer logger.lock.Unlock()

	if !logger.running {
		fmt.Printf("Logger already stopped")
		return
	}

	var wg sync.WaitGroup
	for _, sublogger := range logger.subloggerMap {
		wg.Add(1)

		go func(sublogger abstraction.Logger) {
			defer wg.Done()
			go sublogger.Stop()
		}(sublogger)
	}
	wg.Wait()

	logger.running = false
	fmt.Printf("Logger stopped")
}
