package order

import (
	"encoding/csv"
	"fmt"
	"os"
	"sync"
	"sync/atomic"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/data"
)

const (
	Name abstraction.LoggerName = "order"
)

type Record struct {
	packet *data.Packet
}

func (order *Record) Name() abstraction.LoggerName {
	return Name
}

type Logger struct {
	// An atomic boolean is used in order to use CompareAndSwap in the Start and Stop methods
	running  *atomic.Bool
	fileLock *sync.RWMutex
	// initialTime fixes the starting time of the log
	initialTime time.Time
	writer      *csv.Writer
}

func (sublogger *Logger) Start() error {
	if !sublogger.running.CompareAndSwap(false, true) {
		fmt.Println("Logger already running")
		return nil
	}
	sublogger.initialTime = time.Now()

	file, err := os.Create(fmt.Sprintf("order_" + sublogger.initialTime.Format(time.RFC3339) + ".csv"))
	if err != nil {
		return &logger.ErrCreatingFile{
			Name:      Name,
			Timestamp: time.Now(),
			Inner:     err,
		}
	}
	sublogger.writer = csv.NewWriter(file)

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

	orderRecord, ok := record.(*Record)
	if !ok {
		return &logger.ErrWrongRecordType{
			Name:      Name,
			Timestamp: time.Now(),
			Expected:  &Record{},
			Received:  record,
		}
	}

	sublogger.fileLock.Lock()
	defer sublogger.fileLock.Unlock()

	err := sublogger.writer.Write([]string{fmt.Sprint(orderRecord.packet.GetValues())})
	if err != nil {
		return err
	}

	sublogger.writer.Flush()
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
