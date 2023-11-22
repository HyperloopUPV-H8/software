package data

import (
	"encoding/csv"
	"fmt"
	"io"
	"os"
	"reflect"
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

type Logger struct {
	running        *atomic.Bool
	runningLock    sync.RWMutex
	initialTime    time.Time
	valueFileSlice map[data.ValueName]io.WriteCloser
}

type Record struct {
	packet *data.Packet
}

func (data *Record) Name() abstraction.LoggerName {
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

	if reflect.TypeOf(record) != reflect.TypeOf(&Record{}) {
		return &logger.ErrWrongRecordType{
			Name:      Name,
			Timestamp: time.Now(),
			Expected:  &Record{},
			Received:  record,
		}
	}

	valueMap := record.(*Record).packet.GetValues()

	sublogger.runningLock.Lock()
	defer sublogger.runningLock.Unlock()

	for valueName, value := range valueMap {
		var packet *Record
		timestamp := packet.packet.Timestamp()

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
			f, err := os.Create("./" + string(valueName) + "/" + string(valueName) + "_" + packet.packet.Timestamp().Format("3339") + ".csv")
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

		writer.Write([]string{timestamp.Format("3339"), val})
		return nil
	}
	return nil
}

func (sublogger *Logger) PullRecord(request abstraction.LoggerRequest) (abstraction.LoggerRecord, error) {
	panic("TODO!")
}

func Stop(sublogger *Logger) {
	sublogger.runningLock.Lock()
	defer sublogger.runningLock.Unlock()

	if !sublogger.running.CompareAndSwap(true, false) {
		fmt.Println("Logger already stopped")
		return
	}

	fmt.Println("Logger stopped")
}
