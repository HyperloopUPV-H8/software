package logger_test

import (
	"encoding/csv"
	"fmt"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger/data"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger/order"
	dataPacketer "github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/data"
	"github.com/rs/zerolog"
	"os"
	"path"
	"testing"
	"time"
)

func TestLogger_Data(t *testing.T) {
	dataSublogger := data.NewLogger()
	orderSublogger := order.NewLogger()
	loggerHandler := logger.NewLogger(map[abstraction.LoggerName]abstraction.Logger{
		data.Name:  dataSublogger,
		order.Name: orderSublogger,
	}, zerolog.New(os.Stdout).With().Timestamp().Logger())

	if err := loggerHandler.Start(); err != nil {
		t.Error(err)
	}

	timestamp := time.Now()

	// Data
	dataPacket := dataPacketer.NewPacketWithValues(
		0,
		map[dataPacketer.ValueName]dataPacketer.Value{
			"test": dataPacketer.NewBooleanValue(true),
		},
		map[dataPacketer.ValueName]bool{
			"test": true,
		})
	dataRecord := &data.Record{
		Packet:    dataPacket,
		From:      "test",
		To:        "test",
		Timestamp: timestamp,
	}
	err := loggerHandler.PushRecord(dataRecord)
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

	if output[0] != fmt.Sprint(timestamp.UnixMilli()) || output[1] != "test" || output[2] != "test" || output[3] != "true" {
		t.Errorf("expected [test true], got %v", output)
	}

	// Order
	orderPacket := dataPacketer.NewPacket(0)
	orderRecord := &order.Record{
		Packet:    orderPacket,
		From:      "test",
		To:        "test",
		Timestamp: timestamp,
	}
	err = loggerHandler.PushRecord(orderRecord)
	if err != nil {
		t.Error(err)
	}

	filename = path.Join(
		"logger/order",
		fmt.Sprintf("order_%s", timestamp.Format(time.RFC3339)),
		"order.csv",
	)
	file, err = os.Open(filename)
	if err != nil {
		t.Error(err)
	}
	defer file.Close()

	output, err = csv.NewReader(file).Read()
	if err != nil {
		t.Error(err)
	}

	if output[0] != fmt.Sprint(timestamp.UnixMilli()) || output[1] != "test" || output[2] != "test" {
		t.Errorf("expected [test test], got %v", output)
	}

	if closeErr := loggerHandler.Stop(); closeErr != nil {
		t.Error(err)
	}

	os.RemoveAll("logger")
}
