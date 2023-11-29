package messages

import (
	"encoding/csv"
	"fmt"
	"io"
	"os"
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

// Record is a struct that implements the abstraction.LoggerRecord interface
type Record struct {
	packet *info.Packet
}

type Logger struct {
	// An atomic boolean is used in order to use CompareAndSwap in the Start and Stop methods
	running  *atomic.Bool
	fileLock *sync.RWMutex
	// initialTime fixes the starting time of the log
	initialTime time.Time
	// infoIdMap is a map that contains the file of each info packet
	infoIdMap map[abstraction.BoardId]io.WriteCloser
	// BoardNames is a map that contains the common name of each board
	BoardNames map[abstraction.BoardId]string
}

func NewLogger(boardMap map[abstraction.BoardId]string) *Logger {
	return &Logger{
		running:    &atomic.Bool{},
		fileLock:   &sync.RWMutex{},
		infoIdMap:  make(map[abstraction.BoardId]io.WriteCloser),
		BoardNames: boardMap,
	}
}

func (info *Record) Name() abstraction.LoggerName {
	return Name
}

func (sublogger *Logger) Start(boardMap map[abstraction.BoardId]string) error {
	if !sublogger.running.CompareAndSwap(false, true) {
		fmt.Println("Logger already running")
		return nil
	}
	sublogger.initialTime = time.Now()

	NewLogger(boardMap)

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

	infoRecord, ok := record.(*Record)
	if !ok {
		return &logger.ErrWrongRecordType{
			Name:      Name,
			Timestamp: time.Now(),
			Expected:  &Record{},
			Received:  record,
		}
	}

	boardId := infoRecord.packet.BoardId
	timestamp := infoRecord.packet.ToTime(infoRecord.packet.Timestamp).Format(time.RFC3339)
	msg := string(infoRecord.packet.Msg)

	sublogger.fileLock.Lock()
	defer sublogger.fileLock.Unlock()

	writerErr := error(nil)

	// The existence check is performed with the board ID
	file, ok := sublogger.infoIdMap[boardId]
	if !ok {
		f, err := os.Create(fmt.Sprintf(sublogger.BoardNames[boardId] + "_" + timestamp + ".csv"))
		if err != nil {
			return &logger.ErrCreatingFile{
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

func (sublogger *Logger) PullRecords() ([]abstraction.LoggerRecord, error) {
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
