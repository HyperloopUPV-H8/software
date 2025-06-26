package data

import (
	"fmt"
	"os"
	"path"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	loggerHandler "github.com/HyperloopUPV-H8/h9-backend/pkg/logger"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger/file"
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
	// saveFiles is a map that contains the file of each value
	saveFiles map[data.ValueName]*file.CSV
	// allowedVars contains the full names (board/valueName) to be logged
	allowedVars map[string]struct{}
}

// Record is a struct that implements the abstraction.LoggerRecord interface
type Record struct {
	Packet    *data.Packet
	From      string
	To        string
	Timestamp time.Time
}

func (*Record) Name() abstraction.LoggerName { return Name }

func NewLogger() *Logger {
	logger := &Logger{
		saveFiles:   make(map[data.ValueName]*file.CSV),
		running:     &atomic.Bool{},
		fileLock:    &sync.RWMutex{},
		allowedVars: nil, // no filter by default
	}

	logger.running.Store(false)
	return logger
}

// SetAllowedVars allows updating the list of allowed variables at runtime
func (sublogger *Logger) SetAllowedVars(allowed []string) {
	allowedMap := make(map[string]struct{}, len(allowed))
	for _, v := range allowed {
		allowedMap[v] = struct{}{}
	}
	sublogger.allowedVars = allowedMap
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
		return loggerHandler.ErrLoggerNotRunning{
			Name:      Name,
			Timestamp: time.Now(),
		}
	}

	dataRecord, ok := record.(*Record)
	if !ok {
		return loggerHandler.ErrWrongRecordType{
			Name:      Name,
			Timestamp: time.Now(),
			Expected:  &Record{},
			Received:  record,
		}
	}

	writeErr := error(nil)
	for valueName, value := range dataRecord.Packet.GetValues() {
		// Filter: only log allowed variables
		if sublogger.allowedVars != nil {
			key := dataRecord.From + "/" + string(valueName)
			if _, ok := sublogger.allowedVars[key]; !ok {
				continue
			}
		}

		var valueRepresentation string
		switch value := value.(type) {
		case numeric:
			valueRepresentation = strconv.FormatFloat(value.Value(), 'f', -1, 64)
		case data.BooleanValue:
			valueRepresentation = strconv.FormatBool(value.Value())
		case data.EnumValue:
			valueRepresentation = string(value.Variant())
		}

		saveFile, err := sublogger.getFile(valueName, dataRecord.From)
		if err != nil {
			return err
		}

		err = saveFile.Write([]string{
			fmt.Sprint(dataRecord.Packet.Timestamp()),
			dataRecord.From,
			dataRecord.To,
			valueRepresentation,
		})
		saveFile.Flush()

		if err != nil {
			writeErr = loggerHandler.ErrWritingFile{
				Name:      Name,
				Timestamp: time.Now(),
				Inner:     err,
			}
			fmt.Println(writeErr)
		}
	}
	return writeErr
}

func (sublogger *Logger) getFile(valueName data.ValueName, board string) (*file.CSV, error) {
	sublogger.fileLock.Lock()
	defer sublogger.fileLock.Unlock()

	valueFile, ok := sublogger.saveFiles[valueName]
	if ok {
		return valueFile, nil
	}

	valueFileRaw, err := sublogger.createFile(valueName, board)
	sublogger.saveFiles[valueName] = file.NewCSV(valueFileRaw)

	return sublogger.saveFiles[valueName], err
}

func (sublogger *Logger) createFile(valueName data.ValueName, board string) (*os.File, error) {
	filename := path.Join(
		"logger",
		loggerHandler.Timestamp.Format(loggerHandler.TimestampFormat),
		"data",
		strings.ToUpper(board),
		fmt.Sprintf("%s.csv", valueName),
	)

	err := os.MkdirAll(path.Dir(filename), os.ModePerm)
	if err != nil {
		return nil, loggerHandler.ErrCreatingAllDir{
			Name:      Name,
			Timestamp: time.Now(),
			Path:      filename,
		}
	}

	return os.Create(path.Join(filename))
}

func (sublogger *Logger) PullRecord(abstraction.LoggerRequest) (abstraction.LoggerRecord, error) {
	panic("TODO!")
}

func (sublogger *Logger) Stop() error {
	if !sublogger.running.CompareAndSwap(true, false) {
		fmt.Println("Logger already stopped")
		return nil
	}

	closeErr := error(nil)
	for valueName, file := range sublogger.saveFiles {
		err := file.Close()
		if err != nil {
			closeErr = loggerHandler.ErrClosingFile{
				Name:      Name,
				Timestamp: time.Now(),
			}

			fmt.Println(valueName, ": ", closeErr)
		}
	}

	sublogger.saveFiles = make(map[data.ValueName]*file.CSV, len(sublogger.saveFiles))

	fmt.Println("Logger stopped")
	return closeErr
}
