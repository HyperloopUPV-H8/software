package logger_handler

import (
	"encoding/csv"
	"fmt"
	"os"
	"path/filepath"
	"sync"

	trace "github.com/rs/zerolog/log"
)

type CSVFile struct {
	fileMx *sync.Mutex
	file   *os.File
	writer *csv.Writer
}

func NewCSVFile(path, name string) (CSVFile, error) {
	trace.Debug().Str("path", path).Str("name", name).Msg("creating save file")
	if err := os.MkdirAll(path, 0777); err != nil {
		trace.Error().Stack().Err(err).Str("path", path).Str("name", name).Msg("failed to create directory")
		return CSVFile{}, err
	}

	fileName := fmt.Sprintf("%s.csv", name)
	file, err := os.Create(filepath.Join(path, fileName))
	os.Chmod(filepath.Join(path, fileName), 0777)

	if err != nil {
		trace.Error().Stack().Err(err).Str("path", path).Str("name", name).Msg("failed to create file")
		return CSVFile{}, err
	}

	return CSVFile{
		fileMx: &sync.Mutex{},
		file:   file,
		writer: csv.NewWriter(file),
	}, nil
}

func (file *CSVFile) Write(data []string) error {
	file.fileMx.Lock()
	defer file.fileMx.Unlock()

	trace.Trace().Strs("data", data).Msg("writing csv")
	if err := file.writer.Write(data); err != nil {
		trace.Error().Stack().Err(err).Strs("data", data).Msg("failed to write csv")
		return err
	}
	return nil
}

func (file *CSVFile) Flush() error {
	file.fileMx.Lock()
	defer file.fileMx.Unlock()

	return file.flushUnsafe()
}

func (file *CSVFile) flushUnsafe() error {
	trace.Debug().Msg("flushing save file")
	file.writer.Flush()
	return file.writer.Error()
}

func FlushFiles[T comparable](files map[T]*CSVFile) (err error) {
	for _, file := range files {
		flushErr := file.Flush()
		if flushErr != nil {
			err = flushErr
		}
	}
	return err
}

func (file *CSVFile) Close() error {
	file.fileMx.Lock()
	defer file.fileMx.Unlock()

	trace.Debug().Msg("closing save file")

	if err := file.flushUnsafe(); err != nil {
		trace.Error().Stack().Err(err).Msg("failed to flush writer")
		return err
	}

	return file.file.Close()
}

func CloseFiles[T comparable](files map[T]*CSVFile) (err error) {
	for _, file := range files {
		closeErr := file.Close()
		if closeErr != nil {
			err = closeErr
		}
	}
	return err
}
