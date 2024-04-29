package broker_test

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/boards"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/blcu"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
	"github.com/rs/zerolog"
	"os"
	"testing"
)

func TestBroker(t *testing.T) {
	brokerAPI := broker.New(zerolog.New(os.Stdout))

	// BLCU
	download := blcu.Download{}
	download.SetPool(&websocket.Pool{})
	download.SetAPI(brokerAPI)

	err := download.Push(boards.DownloadSuccess{
		Data: []byte("hello"),
	})
	if err != nil {
		t.Fatalf("BLCU/failed to push: %v", err)
	}

	err = download.Push(boards.DownloadFailure{
		Error: nil,
	})
	if err != nil {
		t.Fatalf("BLCU/failed to push: %v", err)
	}

	upload := blcu.Upload{}
	upload.SetPool(&websocket.Pool{})
	upload.SetAPI(brokerAPI)

	err = upload.Push(boards.UploadSuccess{})
	if err != nil {
		t.Fatalf("BLCU/failed to push: %v", err)
	}

	err = upload.Push(boards.UploadFailure{})
	if err != nil {
		t.Fatalf("BLCU/failed to push: %v", err)
	}
}
