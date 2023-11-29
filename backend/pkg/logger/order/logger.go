package order

import (
	"fmt"
	"io"
	"sync"
	"sync/atomic"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

const (
	Name abstraction.LoggerName = "order"
)

type Logger struct {
	// An atomic boolean is used in order to use CompareAndSwap in the Start and Stop methods
	running  *atomic.Bool
	fileLock *sync.RWMutex
	// initialTime fixes the starting time of the log
	initialTime time.Time
	// infoIdMap is a map that contains the file of each order packet
	orderIdMap map[abstraction.BoardId]io.WriteCloser
}

func (sublogger *Logger) Name() abstraction.LoggerName {
	return Name
}

func (sublogger *Logger) Start() error {
	if !sublogger.running.CompareAndSwap(false, true) {
		fmt.Println("Logger already running")
		return nil
	}
	sublogger.initialTime = time.Now()

	fmt.Println("Logger started")
	return nil
}

func (sublogger *Logger) PushRecord(record abstraction.LoggerRecord) error {

	return nil
}

func (sublogger *Logger) PullRecord() (abstraction.LoggerRecord, error) {
	panic("TODO!")
}

func (sublogger *Logger) Stop() error {
	if !sublogger.running.CompareAndSwap(true, false) {
		fmt.Println("Logger already stopped")
		return nil
	}

	fmt.Println("Logger stopped")
	return nil
}
