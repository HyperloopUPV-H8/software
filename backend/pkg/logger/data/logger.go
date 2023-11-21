package data

import (
	"fmt"
	"io"
	"os"
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
	running     *atomic.Bool
	valueFiles  map[data.ValueName]*io.WriteCloser
	lock        sync.RWMutex
	initialTime time.Time
}

type Record struct {
	packet *data.Packet
}

func (data *Record) Name() abstraction.LoggerName {
	return Name
}

func (sublogger *Logger) Start() error {
	sublogger.initialTime = time.Now()

	sublogger.lock.Lock()
	defer sublogger.lock.Unlock()

	if sublogger.running.Load() {
		fmt.Printf("Logger already running")
		return nil
	}

	sublogger.running.Store(true)
	fmt.Printf("Logger started")
	return nil
}

type numeric interface {
	Value() float64
}

func (sublogger *Logger) PushRecord(record abstraction.LoggerRecord) error {
	sublogger.lock.Lock()
	defer sublogger.lock.Unlock()

	valueMap := record.(*Record).packet.GetValues()

	for valueName, value := range valueMap {
		var packet *data.Packet
		var val string

		switch v := value.(type) {
		case numeric:
			val = strconv.FormatFloat(v.Value(), 'f', -1, 64)

		case data.BooleanValue:
			val = strconv.FormatBool(v.Value())

		case data.EnumValue:
			val = string(v.Variant())
		}

		file, err := os.OpenFile(string(valueName)+"_"+sublogger.initialTime.Format(time.RFC3339)+".csv", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
		if err != nil {
			return &logger.ErrCreatingFile{
				Name:      Name,
				Timestamp: time.Now(),
				Inner:     err,
			}
		}

		file.Write([]byte((packet.Timestamp().Format(time.RFC3339) + "," + val + "\n")))
	}
	sublogger.lock.Unlock()
	return nil
}

func (sublogger *Logger) PullRecord(request abstraction.LoggerRequest) (abstraction.LoggerRecord, error) {
	panic("TODO!")
}

func Stop(sublogger *Logger) {
	sublogger.lock.Lock()
	defer sublogger.lock.Unlock()

	if !sublogger.running.Load() {
		fmt.Printf("Logger already stopped")
		return
	}

	sublogger.running.Store(false)
	fmt.Printf("Logger stopped")
}
