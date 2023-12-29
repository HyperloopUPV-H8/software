package messages

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
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/info"
)

const (
	Name abstraction.LoggerName = "messages"
)

type Logger struct {
	// An atomic boolean is used in order to use CompareAndSwap in the Start and Stop methods
	running  *atomic.Bool
	fileLock *sync.RWMutex
	// infoIdMap is a map that contains the file of each info packet
	infoIdMap map[abstraction.BoardId]io.WriteCloser
	// BoardNames is a map that contains the common name of each board
	boardNames map[abstraction.BoardId]string
}

// Record is a struct that implements the abstraction.LoggerRecord interface
type Record struct {
	Packet *info.Packet
}

func (info *Record) Name() abstraction.LoggerName {
	return Name
}

func NewLogger(boardMap map[abstraction.BoardId]string) *Logger {
	return &Logger{
		running:    &atomic.Bool{},
		fileLock:   &sync.RWMutex{},
		infoIdMap:  make(map[abstraction.BoardId]io.WriteCloser),
		boardNames: boardMap,
	}
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
		return logger.ErrLoggerNotRunning{
			Name:      Name,
			Timestamp: time.Now(),
		}
	}

	infoRecord, ok := record.(*Record)
	if !ok {
		return logger.ErrWrongRecordType{
			Name:      Name,
			Timestamp: time.Now(),
			Expected:  &Record{},
			Received:  record,
		}
	}

	boardId := infoRecord.Packet.BoardId
	timestamp := infoRecord.Packet.Timestamp.ToTime().Format(time.RFC3339)
	msg := string(infoRecord.Packet.Msg)

	sublogger.fileLock.Lock()
	defer sublogger.fileLock.Unlock()

	writerErr := error(nil)

	// The existence check is performed with the board ID
	file, ok := sublogger.infoIdMap[boardId]
	if !ok {
		boardName, ok := sublogger.boardNames[boardId]
		if !ok {
			boardName = fmt.Sprint(boardId)
		}

		filename := path.Join("logger/messages", fmt.Sprintf("messages_%s", logger.Timestamp.Format(time.RFC3339)), fmt.Sprintf("%s.csv", boardName))
		err := os.MkdirAll(path.Dir(filename), os.ModePerm)
		if err != nil {
			return logger.ErrCreatingAllDir{
				Name:      Name,
				Timestamp: time.Now(),
				Path:      filename,
			}
		}

		f, err := os.Create(filename)
		if err != nil {
			return logger.ErrCreatingFile{
				Name:      Name,
				Timestamp: time.Now(),
				Inner:     err,
			}
		}
		sublogger.infoIdMap[boardId] = f
		file = f
	}
	writer := csv.NewWriter(file)
	defer writer.Flush()

	err := writer.Write([]string{timestamp, msg})
	if err != nil {
		writerErr = err
	}

	return writerErr
}

func (sublogger *Logger) PullRecord(abstraction.LoggerRequest) (abstraction.LoggerRecord, error) {
	panic("TODO!")
}

func (sublogger *Logger) Stop() error {
	if !sublogger.running.CompareAndSwap(true, false) {
		fmt.Println("Logger already stopped")
		return nil
	}

	for _, file := range sublogger.infoIdMap {
		err := file.Close()
		if err != nil {
			return logger.ErrClosingFile{
				Name:      Name,
				Timestamp: time.Now(),
			}
		}
	}

	fmt.Println("Logger stopped")
	return nil
}
