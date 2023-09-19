package value_logger

import (
	"path/filepath"
	"sync"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/HyperloopUPV-H8/h9-backend/internal/logger_handler"
	"github.com/HyperloopUPV-H8/h9-backend/internal/pod_data"
	"github.com/rs/zerolog"
	trace "github.com/rs/zerolog/log"
)

type ValueLogger struct {
	ids           common.Set[string]
	filesMx       *sync.Mutex
	flushInterval time.Duration
	folderName    string
	trace         zerolog.Logger
}

type Config struct {
	FolderName    string `toml:"folder_name"`
	FlushInterval string `toml:"flush_interval"`
}

func NewValueLogger(boards []pod_data.Board, config Config) ValueLogger {
	trace := trace.With().Str("component", "valueLogger").Logger()

	ids := getValueIds(boards)

	flushInterval, err := time.ParseDuration(config.FlushInterval)

	if err != nil {
		trace.Fatal().Err(err).Str("flushInterval", config.FlushInterval).Msg("error parsing flush duration")
	}

	return ValueLogger{
		ids:           ids,
		folderName:    config.FolderName,
		filesMx:       &sync.Mutex{},
		flushInterval: flushInterval,
		trace:         trace,
	}
}

func getValueIds(boards []pod_data.Board) common.Set[string] {
	ids := common.NewSet[string]()

	for _, board := range boards {
		for _, packet := range board.Packets {
			for _, meas := range packet.Measurements {
				ids.Add(meas.GetId())
			}
		}
	}

	return ids
}

func (vl *ValueLogger) Ids() common.Set[string] {
	return vl.ids
}

func (vl *ValueLogger) Start(basePath string) chan<- logger_handler.Loggable {
	loggableChan := make(chan logger_handler.Loggable)

	go vl.startLoggingRoutine(loggableChan, basePath)

	return loggableChan
}

func (vl *ValueLogger) startLoggingRoutine(loggableChan <-chan logger_handler.Loggable, basePath string) {
	files := make(map[string]logger_handler.CSVFile)
	flushTicker := time.NewTicker(vl.flushInterval)
	done := make(chan struct{})

	go vl.startFlushRoutine(flushTicker.C, files, done)

	for loggable := range loggableChan {
		vl.filesMx.Lock()
		file := getOrAddFile(files, filepath.Join(basePath, vl.folderName), loggable.Id(), vl.trace)
		file.Write(loggable.Log())
		vl.filesMx.Unlock()
	}

	done <- struct{}{}
	flushTicker.Stop()

	closeFiles(files, vl.trace)
}

func getOrAddFile(files map[string]logger_handler.CSVFile, path string, name string, trace zerolog.Logger) logger_handler.CSVFile {
	file, ok := files[name]
	if !ok {
		newFile, err := logger_handler.NewCSVFile(path, name)

		if err != nil {
			trace.Fatal().Err(err).Msg("error creating file")
		}
		files[name] = newFile
		return newFile
	}

	return file
}

func (vl *ValueLogger) startFlushRoutine(tickerChan <-chan time.Time, files map[string]logger_handler.CSVFile, done chan struct{}) {
loop:
	for {
		select {
		case <-tickerChan:
			vl.filesMx.Lock()
			for _, file := range files {
				file.Flush()
			}
			vl.filesMx.Unlock()
		case <-done:
			break loop
		}
	}
}

func closeFiles(files map[string]logger_handler.CSVFile, trace zerolog.Logger) {
	for _, file := range files {
		err := file.Close()

		if err != nil {
			trace.Error().Err(err).Msg("error closing file")
		}
	}
}
