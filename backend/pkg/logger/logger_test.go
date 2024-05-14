package logger_test

import (
	"encoding/csv"
	"fmt"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger/data"
	packetData "github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/data"
	"github.com/rs/zerolog"
	"os"
	"path"
	"testing"
	"time"
)

func TestLogger_Data(t *testing.T) {
	sublogger := data.NewLogger()
	logger := logger.NewLogger(map[abstraction.LoggerName]abstraction.Logger{
		data.Name: sublogger,
	}, zerolog.New(os.Stdout).With().Timestamp().Logger())

	if err := logger.Start(); err != nil {
		t.Error(err)
	}

	timestamp := time.Now()
	packet := packetData.NewPacketWithValues(
		0,
		map[packetData.ValueName]packetData.Value{
			"test": packetData.NewBooleanValue(true),
		},
		map[packetData.ValueName]bool{
			"test": true,
		})
	record := &data.Record{
		Packet:    packet,
		From:      "test",
		To:        "test",
		Timestamp: timestamp,
	}
	err := logger.PushRecord(record)
	if err != nil {
		t.Error(err)
	}

	filename := path.Join(
		"logger/data",
		fmt.Sprintf("data_%s", timestamp.Format(time.RFC3339)),
		fmt.Sprintf("%s.csv", "test"),
	)
	file, err := os.Open(filename)
	if err != nil {
		t.Error(err)
	}
	defer file.Close()

	output, err := csv.NewReader(file).Read()
	if err != nil {
		t.Error(err)
	}

	if output[2] != "test" || output[3] != "true" {
		t.Errorf("expected [test true], got %v", output)
	}

	if closeErr := logger.Stop(); closeErr != nil {
		t.Error(err)
	}

	os.RemoveAll("logger")
}
