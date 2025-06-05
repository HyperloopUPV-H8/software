package boards_test

import (
	"testing"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/boards"
	blcu_topic "github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/blcu"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/vehicle"
	"github.com/rs/zerolog"
)

// TestBLCUBoardRegistration tests that BLCU board can be registered
func TestBLCUBoardRegistration(t *testing.T) {
	logger := zerolog.New(nil).Level(zerolog.Disabled)
	v := vehicle.New(logger)
	
	// Create and register BLCU board
	blcuBoard := boards.New("192.168.0.10")
	v.AddBoard(blcuBoard)
	
	// Verify board is registered
	if blcuBoard.Id() != boards.BlcuId {
		t.Errorf("Expected board ID %d, got %d", boards.BlcuId, blcuBoard.Id())
	}
}

// TestBLCURequestStructures tests the request structures
func TestBLCURequestStructures(t *testing.T) {
	// Test download request
	downloadReq := &blcu_topic.DownloadRequest{
		Board: "VCU",
	}
	if downloadReq.Topic() != "blcu/downloadRequest" {
		t.Errorf("Expected topic 'blcu/downloadRequest', got '%s'", downloadReq.Topic())
	}
	
	// Test upload request
	uploadReq := &blcu_topic.UploadRequest{
		Board: "VCU",
		File:  "dGVzdCBkYXRh", // base64 for "test data"
	}
	if uploadReq.Topic() != "blcu/uploadRequest" {
		t.Errorf("Expected topic 'blcu/uploadRequest', got '%s'", uploadReq.Topic())
	}
	
	// Test internal upload request
	uploadReqInternal := &blcu_topic.UploadRequestInternal{
		Board: "VCU",
		Data:  []byte("test data"),
	}
	if uploadReqInternal.Topic() != "blcu/uploadRequest" {
		t.Errorf("Expected topic 'blcu/uploadRequest', got '%s'", uploadReqInternal.Topic())
	}
}