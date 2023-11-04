package file_logger

import (
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/HyperloopUPV-H8/h9-backend/internal/logger_handler"
	"github.com/rs/zerolog"
	trace "github.com/rs/zerolog/log"
)

type FileLogger struct {
	ids           common.Set[string]
	fileName      string
	flushInterval time.Duration
	trace         zerolog.Logger
}

type Config struct {
	FileName      string `toml:"file_name"`
	FlushInterval string `toml:"flush_interval"`
}

func NewFileLogger(name string, ids common.Set[string], config Config) FileLogger {
	trace := trace.With().Str("component", name).Logger()

	flushInterval, err := time.ParseDuration(config.FlushInterval)

	if err != nil {
		trace.Fatal().Err(err).Msg("error parsing flush interval")
	}

	return FileLogger{
		ids:           ids,
		fileName:      config.FileName,
		flushInterval: flushInterval,
		trace:         trace,
	}
}

func (fl *FileLogger) Ids() common.Set[string] {
	return fl.ids
}

func (fl *FileLogger) Start(basePath string) chan<- logger_handler.Loggable {
	loggableChan := make(chan logger_handler.Loggable)

	go fl.startLoggingRoutine(loggableChan, basePath)

	return loggableChan
}

func (fl *FileLogger) startLoggingRoutine(loggableChan <-chan logger_handler.Loggable, basePath string) {
	file := fl.createFile(basePath)
	flushTicker := time.NewTicker(fl.flushInterval)
	done := make(chan struct{})
	go fl.startFlushRoutine(flushTicker.C, file, done)

	for loggable := range loggableChan {
		if fl.ids.Has(loggable.Id()) {
			file.Write(loggable.Log())
		}
	}

	done <- struct{}{}
	flushTicker.Stop()
	file.Close()
}

func (fl *FileLogger) createFile(basePath string) logger_handler.CSVFile {
	file, err := logger_handler.NewCSVFile(basePath, fl.fileName)

	if err != nil {
		fl.trace.Fatal().Err(err).Msg("error creating file")
	}

	return file
}

func (fl *FileLogger) startFlushRoutine(tickerChan <-chan time.Time, file logger_handler.CSVFile, done chan struct{}) {
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
