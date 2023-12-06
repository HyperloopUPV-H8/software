package state

import (
	"encoding/csv"
	"fmt"
	"os"
	"sync/atomic"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/state"
)

const (
	Name abstraction.LoggerName = "state"
)

type Record struct {
	packet *state.Space
}

func (record *Record) Name() abstraction.LoggerName {
	return Name
}

func NewLogger() *Logger {
	return &Logger{}
}

type Logger struct {
	// An atomic boolean is used in order to use CompareAndSwap in the Start and Stop methods
	running *atomic.Bool
}

func (sublogger *Logger) Start() error {
	if !sublogger.running.CompareAndSwap(false, true) {
		fmt.Println("Logger already running")
		return nil
	}

	fmt.Println("Logger started")
	return nil
}

func (sublogger *Logger) PushRecord(record abstraction.LoggerRecord) error {
	if !sublogger.running.Load() {
		return &logger.ErrLoggerNotRunning{
			Name:      Name,
			Timestamp: time.Now(),
		}
	}

	stateRecord, ok := record.(*Record)
	if !ok {
		return &logger.ErrWrongRecordType{
			Name:      Name,
			Timestamp: time.Now(),
			Expected:  &Record{},
			Received:  record,
		}
	}

	file, err := os.Create(fmt.Sprintf("state_" + time.Now().Format(time.RFC3339) + ".csv"))
	if err != nil {
		return &logger.ErrCreatingFile{
			Name:      Name,
			Timestamp: time.Now(),
			Inner:     err,
		}
	}
	writer := csv.NewWriter(file)
	defer writer.Flush()

	for _, item := range stateRecord.packet.State() {
		err = writer.Write([]string{fmt.Sprint(item)})
		if err != nil {
			return err
		}
	}

	return nil
}

func (sublogger *Logger) PullRecord(abstraction.LoggerRequest) (abstraction.LoggerRecord, error) {
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
