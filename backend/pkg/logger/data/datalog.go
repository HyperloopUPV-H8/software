package data

import (
	"encoding/csv"
	"errors"
	"fmt"
	"os"
	"sync"
	"time"
)

type DataRecord struct {
	Timestamp  string
	RecordData string
}

type DataReq struct {
	Timestamp string
}

type csvLogger struct {
	file    *os.File
	writer  *csv.Writer
	mu      sync.Mutex
	records chan *DataRecord
	ticker  *time.Ticker
	done    chan bool
}

var dataLogger = &csvLogger{
	records: make(chan *DataRecord),
	ticker:  time.NewTicker(5 * time.Second),
	done:    make(chan bool),
}

func initializeCSVLogger(logger *csvLogger, record *DataRecord) error {
	logger.mu.Lock()
	defer logger.mu.Unlock()

	filename := fmt.Sprintf("data_%s.csv", record.Timestamp)

	var err error
	logger.file, err = os.OpenFile(filename, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		return err
	}
	logger.writer = csv.NewWriter(logger.file)
	info, _ := logger.file.Stat()
	if info.Size() == 0 {
		if err := logger.writer.Write([]string{"Timestamp", "Data"}); err != nil {
			return err
		}
	}

	go func() {
		for {
			select {
			case record := <-logger.records:
				logger.mu.Lock()
				logger.writer.Write([]string{record.Timestamp, record.RecordData})
				logger.mu.Unlock()
			case <-logger.ticker.C:
				logger.mu.Lock()
				logger.writer.Flush()
				logger.mu.Unlock()
			case <-logger.done:
				logger.ticker.Stop()
				return
			}
		}
	}()

	return nil
}

func DataLog(record interface{}) error {
	r, ok := record.(*DataRecord)
	if !ok {
		return errors.New("type assertion to *DataRecord failed")
	}

	if dataLogger.writer == nil {
		if err := initializeCSVLogger(dataLogger, r); err != nil {
			return err
		}
	}
	dataLogger.records <- r
	return nil
}

func DataRequest(request interface{}) (interface{}, error) {
	r, ok := request.(*DataReq)
	if !ok {
		return nil, errors.New("request type assertion to *DataRequest failed")
	}

	filename := fmt.Sprintf("data_%s.csv", r.Timestamp)

	file, err := os.Open(filename)
	if err != nil {
		return "", err
	}
	defer file.Close()

	reader := csv.NewReader(file)

	records, err := reader.ReadAll()
	if err != nil {
		return "", err
	}

	for _, record := range records {
		if record[0] == r.Timestamp {
			return record[1], nil
		}
	}

	return "", errors.New("no record found with the given timestamp")
}

func CloseDataLogger() error {
	dataLogger.done <- true
	close(dataLogger.records)
	close(dataLogger.done)
	dataLogger.mu.Lock()
	defer dataLogger.mu.Unlock()
	dataLogger.writer.Flush()
	if err := dataLogger.writer.Error(); err != nil { // Check for any errors that occurred during the writes
		return err
	}
	if err := dataLogger.file.Close(); err != nil { // Close the file
		return err
	}
	return nil
}
