package datasublogger

import (
	"encoding/csv"
	"os"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type CSVSublogger struct {
	file   *os.File
	writer *csv.Writer
}

func (s *CSVSublogger) Log(timestamp time.Time, message string) abstraction.Sublogger {
	s.writer.Write([]string{timestamp.Format(time.RFC3339), message})
	s.writer.Flush()
	return nil
}

func (s *CSVSublogger) Start() {
	file, err := os.Create("data_" + time.Now().Format(time.RFC3339) + ".csv")
	if err != nil {
		panic(err)
	}
	s.file = file
	s.writer = csv.NewWriter(file)
}

func (s *CSVSublogger) Stop() {
	s.file.Close()
}
