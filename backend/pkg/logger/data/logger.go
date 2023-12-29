package data

import (
	"encoding/csv"
	"fmt"
	"io"
	"os"
	"path"
	"strconv"
	"sync"
	"sync/atomic"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/data"
)

const (
	Name abstraction.LoggerName = "data"
)

// Logger is a struct that implements the abstraction.Logger interface
type Logger struct {
	// An atomic boolean is used in order to use CompareAndSwap in the Start and Stop methods
	running  *atomic.Bool
	fileLock *sync.RWMutex
	// valueFileSlice is a map that contains the file of each value
	valueFileSlice map[data.ValueName]io.WriteCloser
}

// Record is a struct that implements the abstraction.LoggerRecord interface
type Record struct {
	Packet    *data.Packet
	From      string
	To        string
	Timestamp time.Time
}

func (*Record) Name() abstraction.LoggerName {
	return Name
}
func (record *Record) GetFrom() string         { return record.From }
func (record *Record) GetTo() string           { return record.To }
func (record *Record) GetTimestamp() time.Time { return record.Timestamp }

func NewLogger() *Logger {
	logger := &Logger{
		valueFileSlice: make(map[data.ValueName]io.WriteCloser),
		running:        &atomic.Bool{},
		fileLock:       &sync.RWMutex{},
	}
	logger.running.Store(false)
	return logger
}

func (sublogger *Logger) Start() error {
	if !sublogger.running.CompareAndSwap(false, true) {
		fmt.Println("Logger already running")
		return nil
	}

	fmt.Println("Logger started")
	return nil
}

// numeric is an interface that allows to get the value of any numeric format
type numeric interface {
	Value() float64
}

func (sublogger *Logger) PushRecord(record abstraction.LoggerRecord) error {
	if !sublogger.running.Load() {
		return &logger.ErrLoggerNotRunning{
			Name:      Name,
			Timestamp: time.Now(),
		}
	}

	dataRecord, ok := record.(*Record)
	if !ok {
		return &logger.ErrWrongRecordType{
			Name:      Name,
			Timestamp: time.Now(),
			Expected:  &Record{},
			Received:  record,
		}
	}

	valueMap := dataRecord.Packet.GetValues()

	sublogger.fileLock.Lock()
	defer sublogger.fileLock.Unlock()

	writerErr := error(nil)
	for valueName, value := range valueMap {

		timestamp := dataRecord.Packet.Timestamp()

		var val string

		switch v := value.(type) {
		case numeric:
			val = strconv.FormatFloat(v.Value(), 'f', -1, 64)

		case data.BooleanValue:
			val = strconv.FormatBool(v.Value())

		case data.EnumValue:
			val = string(v.Variant())
		}

		file, ok := sublogger.valueFileSlice[valueName]
		if !ok {
			filename := path.Join("logger/data", fmt.Sprintf("data_%s", logger.Timestamp.Format(time.RFC3339)), fmt.Sprintf("%s.csv", valueName))
			os.MkdirAll(path.Dir(filename), os.ModePerm)

			f, err := os.Create(path.Join(filename))
			if err != nil {
				return &logger.ErrCreatingFile{
					Name:      Name,
					Timestamp: time.Now(),
					Inner:     err,
				}
			}
			sublogger.valueFileSlice[valueName] = f
			file = f
		}
		writer := csv.NewWriter(file) // TODO! use map/slice of writers
		defer writer.Flush()

		err := writer.Write([]string{timestamp.Format(time.RFC3339), val, record.GetFrom(), record.GetTo(), record.GetTimestamp().Format(time.RFC3339)})
		if err != nil {
			writerErr = err
		}
	}
	return writerErr
}

func (sublogger *Logger) PullRecord(request abstraction.LoggerRequest) (abstraction.LoggerRecord, error) {
	panic("TODO!")
}

func (sublogger *Logger) Stop() error {
	if !sublogger.running.CompareAndSwap(true, false) {
		fmt.Println("Logger already stopped")
		return nil
	}

	for _, file := range sublogger.valueFileSlice {
		file.Close()
	}

	fmt.Println("Logger stopped")
	return nil
}
