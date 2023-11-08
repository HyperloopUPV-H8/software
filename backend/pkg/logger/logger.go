/*
The logger package is responsible for logging the data received from the
pod and also for reaching that data later on

As for 2023-11-08 the logger is in need of the implementation of handling
functions or a logger_handler file.
The logger needs an implementation of a "file" interface.
*/

package logger

import (
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/internal/logger_handler"
	"github.com/rs/zerolog"
	trace "github.com/rs/zerolog/log"
)

type Logger struct {
	ID            string // common.Set[string] or other similar resolution
	file          string
	flushInterval time.Duration
	trace         zerolog.Logger
}

type Config struct {
	Filename      string `toml:"filename"`
	FlushInterval string `toml:"flush_interval"`
}

/*
TODO!
type file interface {
	Flush()
	Write(data []byte)
	Has(id string) bool
	Close()
}

/*
TODO!
type LogType interface {
	Type() string
}
*/

func NewLogger(name string, id string, config Config) Logger {
	trace := trace.With().Str("component", name).Logger()

	flushInterval, err := time.ParseDuration(config.FlushInterval)
	if err != nil {
		trace.Fatal().Err(err).Msg("error parsing flush interval")
	}

	return Logger{
		ID:            id,
		file:          config.Filename,
		flushInterval: flushInterval,
		trace:         trace,
	}
}

func (l *Logger) Start(basePath string) {
	go func() {
		for {
			time.Sleep(l.flushInterval)
			l.FlushRoutine()
		}
	}()
}

func (l *Logger) StartLogger(data string, basePath string, file string) {
	file := l.createFile(basePath)
	flushTicker := time.NewTicker(l.flushInterval)
	done := make(chan struct{})
	go l.FlushRoutine(flushTicker.C, file, done)

	for data := range data {
		if l.ID.Has(data.ID()) {
			file.Write(data)
		}
	}

	done <- struct{}{}
	flushTicker.Stop()
	file.Close()
}

func (l *Logger) StopLogger(done chan struct{}) {
	done <- struct{}{}
}

func (l *Logger) createFile(basePath string) logger_handler.CSVFile {
	file, err := logger_handler.NewCSVFile(basePath, fl.fileName)
	if err != nil {
		l.trace.Fatal().Err(err).Msg("error creating file")
	}
	return file
}

func (l *Logger) FlushRoutine(tickerChan <-chan time.Time, file string, done chan struct{}) {
loop:
	for {
		select {
		case <-tickerChan:
			file.Flush()
		case <-done:
			break loop
		}
	}
}
