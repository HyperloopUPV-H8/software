package protection

import (
	"fmt"
	"os"
	"path"
	"sync"
	"sync/atomic"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger/file"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/protection"
)

const (
	Name abstraction.LoggerName = "protections"
)

type Logger struct {
	// An atomic boolean is used in order to use CompareAndSwap in the Start and Stop methods
	running  *atomic.Bool
	fileLock *sync.Mutex
	// saveFiles is a map that contains the file of each info packet
	saveFiles map[abstraction.BoardId]*file.CSV
	// BoardNames is a map that contains the common name of each board
	boardNames map[abstraction.BoardId]string
}

// Record is a struct that implements the abstraction.LoggerRecord interface
type Record struct {
	Packet    *protection.Packet
	BoardId   abstraction.BoardId
	From      string
	To        string
	Timestamp time.Time
}

func (*Record) Name() abstraction.LoggerName { return Name }

func NewLogger(boardMap map[abstraction.BoardId]string) *Logger {
	return &Logger{
		running:    &atomic.Bool{},
		fileLock:   &sync.Mutex{},
		saveFiles:  make(map[abstraction.BoardId]*file.CSV),
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

	saveFile, err := sublogger.getFile(infoRecord.BoardId)
	if err != nil {
		return err
	}

	err = saveFile.Write([]string{
		fmt.Sprint(infoRecord.Timestamp.UnixMilli()),
		infoRecord.From,
		infoRecord.To,
		fmt.Sprint(infoRecord.Packet.Id()),
		fmt.Sprint(infoRecord.Packet.Type),
		fmt.Sprint(infoRecord.Packet.Kind),
		infoRecord.Packet.Name,
		fmt.Sprint(infoRecord.Packet.Data),
		infoRecord.Packet.Timestamp.ToTime().Format(time.RFC3339),
	})
	saveFile.Flush()
	return err
}

func (sublogger *Logger) getFile(boardId abstraction.BoardId) (*file.CSV, error) {
	sublogger.fileLock.Lock()
	defer sublogger.fileLock.Unlock()

	valueFile, ok := sublogger.saveFiles[boardId]
	if ok {
		return valueFile, nil
	}

	valueFileRaw, err := sublogger.createFile(boardId)
	sublogger.saveFiles[boardId] = file.NewCSV(valueFileRaw)

	return sublogger.saveFiles[boardId], err
}

func (sublogger *Logger) createFile(boardId abstraction.BoardId) (*os.File, error) {
	boardName, ok := sublogger.boardNames[boardId]
	if !ok {
		boardName = fmt.Sprint(boardId)
	}

	filename := path.Join(
		"logger",
		logger.Timestamp.Format(logger.TimestampFormat),
		"protections",
		fmt.Sprintf("%s.csv", boardName),
	)

	err := os.MkdirAll(path.Dir(filename), os.ModePerm)
	if err != nil {
		return nil, logger.ErrCreatingAllDir{
			Name:      Name,
			Timestamp: time.Now(),
			Path:      filename,
		}
	}

	return os.Create(filename)
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
	for _, file := range sublogger.saveFiles {
		err := file.Close()
		if err != nil {
			closeErr = logger.ErrClosingFile{
				Name:      Name,
				Timestamp: time.Now(),
			}
			fmt.Println(closeErr.Error())
		}
	}

	sublogger.saveFiles = make(map[abstraction.BoardId]*file.CSV, len(sublogger.saveFiles))

	fmt.Println("Logger stopped")
	return closeErr
}
