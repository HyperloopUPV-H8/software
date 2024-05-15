package logger_test

import (
	"encoding/csv"
	"fmt"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger/data"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger/order"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger/protection"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/logger/state"
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
	stateSublogger := state.NewLogger()
	loggerHandler := logger.NewLogger(map[abstraction.LoggerName]abstraction.Logger{
		data.Name:       dataSublogger,
		order.Name:      orderSublogger,
		protection.Name: protectionSublogger,
		state.Name:      stateSublogger,
	}, zerolog.New(os.Stdout).With().Timestamp().Logger())

	if err := loggerHandler.Start(); err != nil {
		t.Error(err)
	}

	timestamp := logger.Timestamp

	time.Sleep(100 * time.Millisecond)

	// Data
	dataPacket := dataPacketer.NewPacketWithValues(
		0,
		map[dataPacketer.ValueName]dataPacketer.Value{
			"test": dataPacketer.NewBooleanValue(true),
		},
		map[dataPacketer.ValueName]bool{
			"test": true,
		})
	dataPacketTime := time.Now()
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
		fmt.Sprintf("%s", timestamp.Format(logger.TimestampFormat)),
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

	if output[0] != fmt.Sprint(dataPacketTime.UnixMilli()) || output[1] != "test" || output[2] != "test" || output[3] != "true" {
		t.Errorf("dataErr: expected [%v test test true], got %v", timestamp.UnixMilli(), output)
	}

	// Order
	orderPacket := dataPacketer.NewPacket(0)
	orderPacketTime := time.Now()
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
		fmt.Sprintf("%s", timestamp.Format(logger.TimestampFormat)),
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

	if output[0] != fmt.Sprint(orderPacketTime.UnixMilli()) || output[1] != "test" || output[2] != "test" {
		t.Errorf("orderErr: expected [test test], got %v", output)
	}

	// Protection
	protectionPacket := protectionPacketer.NewPacket(0, protectionPacketer.Ok)
	protectionPacket.Timestamp = &protectionPacketer.Timestamp{
		Counter: 0,
		Second:  0,
		Minute:  0,
		Hour:    0,
		Day:     0,
		Month:   0,
		Year:    0,
	}
	protectionPacket.Name = "test"
	protectionPacket.Kind = protectionPacketer.EqualsKind
	protectionPacket.Data = &protectionPacketer.Equals[int8]{
		Target: 0,
		Value:  0,
	}
	protectionPacket.Type = protectionPacketer.Uint8Type
	protectionRecord := &protection.Record{
		Packet:    protectionPacket,
		BoardId:   abstraction.BoardId(0),
		From:      "test",
		To:        "test",
		Timestamp: timestamp,
	}
	protectionPacketTime := protectionPacket.Timestamp.ToTime()

	err = loggerHandler.PushRecord(protectionRecord)
	if err != nil {
		t.Error(err)
	}

	filename = path.Join(
		"logger/protections",
		fmt.Sprintf("%s", timestamp.Format(logger.TimestampFormat)),
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

	if output[0] != fmt.Sprint(timestamp.UnixMilli()) || output[1] != "test" || output[2] != "test" || output[3] != "0" || output[4] != "7" || output[5] != "3" || output[6] != "test" || output[7] != "&{0 0}" || output[8] != protectionPacketTime.Format(time.RFC3339) {
		t.Errorf("orderErr: expected [test test 0], got %v", output)
	}

	if closeErr := loggerHandler.Stop(); closeErr != nil {
		t.Error(err)
	}

	os.RemoveAll("logger")
}
