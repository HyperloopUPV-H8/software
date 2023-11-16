package data

import (
	"errors"
	"fmt"
	"os"
	"sync"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type Sublogger struct {
	running bool
	lock    sync.Mutex
}

func (sublog *Sublogger) Start() {
	sublog.lock.Lock()
	defer sublog.lock.Unlock()

	if sublog.running {
		fmt.Printf("Logger already running")
		return
	}

	sublog.running = true
	fmt.Printf("Logger started")
}

func PushRecord(record abstraction.LoggerRecord) {
	panic("TODO!")
}

func PullRecord(request abstraction.LoggerRequest) (abstraction.LoggerRecord, error) {
	panic("TODO!")
}

func Stop(sublog *Sublogger) {
	sublog.lock.Lock()
	defer sublog.lock.Unlock()

	if !sublog.running {
		fmt.Printf("Logger already stopped")
		return
	}

	sublog.running = false
	fmt.Printf("Logger stopped")
}

func NewFile() (*os.File, error) {
	file, err := os.Create("data_" + time.Now().Format(time.RFC3339) + ".csv")
	if err != nil {
		return nil, errors.New("error creating file")
	}
	return file, nil
}
