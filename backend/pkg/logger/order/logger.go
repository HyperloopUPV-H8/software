package order

import (
	"encoding/csv"
	"fmt"
	"io"
	"os"
	"path"
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

type Logger struct {
	// An atomic boolean is used in order to use CompareAndSwap in the Start and Stop methods
	running  *atomic.Bool
	fileLock *sync.RWMutex
	// initialTime fixes the starting time of the log
	initialTime time.Time
	writer      io.WriteCloser
}

type Record struct {
	Packet *data.Packet
}

func (order *Record) Name() abstraction.LoggerName {
	return Name
}

func NewLogger() *Logger {
	return &Logger{
		running:  &atomic.Bool{},
		fileLock: &sync.RWMutex{},
	}
}

func (sublogger *Logger) Start() error {
	if !sublogger.running.CompareAndSwap(false, true) {
		fmt.Println("Logger already running")
		return nil
	}
	sublogger.initialTime = time.Now()

	filename := fmt.Sprintf("order_" + sublogger.initialTime.Format(time.RFC3339) + ".csv")
	file, err := os.Create(path.Join("../pkg/logger/order", filename))
	if err != nil {
		return &logger.ErrCreatingFile{
			Name:      Name,
			Timestamp: time.Now(),
			Inner:     err,
		}
	}
	sublogger.writer = file

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

	csvWriter := csv.NewWriter(sublogger.writer)
	err := csvWriter.Write([]string{time.Now().Format(time.RFC3339), fmt.Sprint(orderRecord.Packet.GetValues())})
	if err != nil {
		return err
	}

	defer csvWriter.Flush()
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

	sublogger.writer.Close()

	fmt.Println("Logger stopped")
	return nil
}
