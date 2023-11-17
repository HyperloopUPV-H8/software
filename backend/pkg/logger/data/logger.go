package data

import (
	"fmt"
	"os"
	"strconv"
	"sync"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/data"
)

type ValueName string

const (
	name abstraction.LoggerName = "data"
)

type Logger struct {
	running    bool
	lock       sync.Mutex
	valueFiles map[data.ValueName]*os.File
}

type DataRecord struct {
	packet *data.Packet
}

func (data *DataRecord) Name() abstraction.LoggerName {
	return name
}

func (sublogger *Logger) Start() error {
	sublogger.lock.Lock()
	defer sublogger.lock.Unlock()

	if sublogger.running {
		fmt.Printf("Logger already running")
		return nil
	}
	sublogger.newFiles()

	sublogger.running = true
	fmt.Printf("Logger started")
	return nil
}

type num interface {
	Value() float64
}

func (sublogger *Logger) PushRecord(record abstraction.LoggerRecord) {
	valueMap := record.(*DataRecord).packet.GetValues()

	for key, value := range valueMap {
		dataPointer := record.(*DataRecord).packet

		var val string

		switch v := value.(type) {
		case num:
			val = strconv.FormatFloat(v.Value(), 'f', -1, 64)

		case data.BooleanValue:
			val = strconv.FormatBool(v.Value())

		case data.EnumValue:
			val = string(v.Variant())
		}
		sublogger.valueFiles[key].WriteString(dataPointer.Timestamp().Format(time.RFC3339) + "," + val)
	}

}

func PullRecord(request abstraction.LoggerRequest) (abstraction.LoggerRecord, error) {
	panic("TODO!")
}

func Stop(sublog *Logger) {
	sublog.lock.Lock()
	defer sublog.lock.Unlock()

	if !sublog.running {
		fmt.Printf("Logger already stopped")
		return
	}

	sublog.running = false
	fmt.Printf("Logger stopped")
}

func (sublogger *Logger) newFiles() error {
	setTime := time.Now().Format(time.RFC3339) + ".csv"

	numericFile, err := os.Create("/numeric/numeric_" + setTime)
	if err != nil {
		return logger.NewErrCreatingFile("numeric", time.Now())
	}
	sublogger.valueFiles["numeric"] = numericFile

	booleanFile, err := os.Create("/boolean/boolean_" + setTime)
	if err != nil {
		return logger.NewErrCreatingFile("boolean", time.Now())
	}
	sublogger.valueFiles["boolean"] = booleanFile

	enumFile, err := os.Create("/enum/enum_" + setTime)
	if err != nil {
		return logger.NewErrCreatingFile("enum", time.Now())
	}
	sublogger.valueFiles["enum"] = enumFile
	return nil
}
