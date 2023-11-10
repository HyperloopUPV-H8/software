package logger

import (
	"encoding/csv"
	"fmt"
	"os"
	"sync"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

var _ abstraction.Logger = &Logger{}

type Record struct {
	NameValue abstraction.LoggerName
	Data      interface{}
	Timestamp time.Time
}

func (r *Record) Name() abstraction.LoggerName {
	return r.NameValue
}

type Logger struct {
	buffer        []Record
	flushInterval time.Duration
	mu            sync.Mutex
	ticker        *time.Ticker
	running       bool
}

func NewLogger(flushInterval time.Duration) *Logger {
	if flushInterval == 0 {
		flushInterval = 5 * time.Second
	}
	return &Logger{
		flushInterval: flushInterval,
	}
}

func (l *Logger) Start() {
	l.mu.Lock()
	defer l.mu.Unlock()
	if l.running {
		return
	}

	l.running = true
	l.ticker = time.NewTicker(l.flushInterval)

	go func() {
		for {
			select {
			case <-l.ticker.C:
				l.flush()
			}
		}
	}()
}

func (l *Logger) Stop() {
	l.mu.Lock()
	defer l.mu.Unlock()

	if !l.running {
		return
	}

	l.running = false
	l.ticker.Stop()
	l.flush()
}

func (l *Logger) PushRecord(record abstraction.LoggerRecord) error {
	l.mu.Lock()
	defer l.mu.Unlock()

	if !l.running {
		return fmt.Errorf("logger is not running")
	}
	if simpleRecord, ok := record.(*Record); ok {
		l.buffer = append(l.buffer, *simpleRecord)
	} else {
		return fmt.Errorf("invalid record type")
	}
	return nil
}

func (l *Logger) PullRecord(request abstraction.LoggerRequest) (abstraction.LoggerRecord, error) {
	panic("TODO!")
}

func (l *Logger) flush() {
	l.mu.Lock()
	defer l.mu.Unlock()

	if len(l.buffer) == 0 {
		return
	}

	filename := fmt.Sprintf("%s-%v.csv", l.buffer[0].Name(), time.Now().Format("20060102150405"))

	file, err := os.Create(filename)
	if err != nil {
		return
	}
	defer file.Close()

	writer := csv.NewWriter(file)

	for _, record := range l.buffer {
		if err := writer.Write([]string{fmt.Sprintf("%v", record.Data)}); err != nil {
			return
		}
	}
	writer.Flush()
	l.buffer = []Record{}
}
