package logger_test

import (
	"encoding/csv"
	"fmt"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger/data"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger/order"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger/protection"
	dataPacketer "github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/data"
	protectionPacketer "github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/protection"
	"github.com/rs/zerolog"
	"os"
	"path"
	"testing"
	"time"
)

func TestLogger(t *testing.T) {
	dataSublogger := data.NewLogger()
	orderSublogger := order.NewLogger()
	protectionSublogger := protection.NewLogger(map[abstraction.BoardId]string{
		0: "test",
	})
	loggerHandler := logger.NewLogger(map[abstraction.LoggerName]abstraction.Logger{
		data.Name:       dataSublogger,
		order.Name:      orderSublogger,
		protection.Name: protectionSublogger,
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
		fmt.Sprintf("data_%s_%s", timestamp.Format("YYYY_MM_DD_HH_mm_ss"), fmt.Sprint(timestamp.Nanosecond())),
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
		t.Errorf("dataErr: expected [test true], got %v", output)
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
		fmt.Sprintf("order_%s_%s", timestamp.Format("YYYY_MM_DD_HH_mm_ss"), fmt.Sprint(timestamp.Nanosecond())),
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
		t.Errorf("orderErr: expected [test test], got %v", output)
	}

	// Protection
	protectionPacket := protectionPacketer.NewPacket(0, protectionPacketer.Ok)
	protectionRecord := &protection.Record{
		Packet:    protectionPacket,
		BoardId:   abstraction.BoardId(0),
		From:      "test",
		To:        "test",
		Timestamp: timestamp,
	}
	err = loggerHandler.PushRecord(protectionRecord)
	if err != nil {
		t.Error(err)
	}

	filename = path.Join(
		"logger/protections",
		fmt.Sprintf("protections_%s_%s", timestamp.Format("YYYY_MM_DD_HH_mm_ss"), fmt.Sprint(timestamp.Nanosecond())),
		fmt.Sprintf("%s.csv", "test"),
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

	if output[0] != fmt.Sprint(timestamp.UnixMilli()) || output[1] != "test" || output[2] != "test" || output[3] != "0" {
		t.Errorf("orderErr: expected [test test 0], got %v", output)
	}

	if closeErr := loggerHandler.Stop(); closeErr != nil {
		t.Error(err)
	}

	// os.RemoveAll("logger")
}
