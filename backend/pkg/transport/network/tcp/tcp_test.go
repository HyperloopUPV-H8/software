package tcp_test

import (
	"encoding/json"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/tcp"
	"github.com/rs/zerolog"
	"os"
	"testing"
	"time"
)

type Socket struct {
	SrcIP   string
	SrcPort uint16
	DstIP   string
	DstPort uint16
}

// Payload defines a piece of information comming from the network with its metadata
type Payload struct {
	Timestamp time.Time
	Socket    Socket
	Data      []byte
}

func TestTCPIntegrationWithPayload(t *testing.T) {
	logger := zerolog.New(os.Stderr).With().Timestamp().Logger()

	// Server setup
	serverAddr := "127.0.0.1:50400"
	server := tcp.NewServer(serverAddr, tcp.ServerConfig{}, logger)
	go func() {
		if err := server.Listen(); err != nil {
			t.Fatalf("Server failed to listen: %v", err)
		}
	}()
	time.Sleep(1 * time.Second)

	// Client setup
	client := tcp.NewClient(serverAddr, tcp.ClientConfig{}, logger)
	conn, err := client.Dial()
	if err != nil {
		t.Fatalf("Client failed to dial: %v", err)
	}
	defer conn.Close()

	// Create and send Payload
	originalPayload := Payload{
		Timestamp: time.Now(),
		Socket: Socket{
			SrcIP:   "127.0.0.1",
			SrcPort: 50400,
			DstIP:   "127.0.0.2",
			DstPort: 50400,
		},
		Data: []byte("hello"),
	}
	payloadBytes, err := json.Marshal(originalPayload)
	if err != nil {
		t.Fatalf("Failed to serialize Payload: %v", err)
	}
	_, err = conn.Write(payloadBytes)
	if err != nil {
		t.Fatalf("Failed to write Payload to server: %v", err)
	}

	// Read and verify Payload
	buffer := make([]byte, 1024)
	n, err := conn.Read(buffer)
	if err != nil {
		t.Fatalf("Failed to read from server: %v", err)
	}
	var receivedPayload Payload
	err = json.Unmarshal(buffer[:n], &receivedPayload)
	if err != nil {
		t.Fatalf("Failed to deserialize Payload: %v", err)
	}

	// Verify Payload content
	if string(receivedPayload.Data) != string(originalPayload.Data) {
		t.Fatalf("Expected message '%s', got '%s'", string(originalPayload.Data), string(receivedPayload.Data))
	}

	server.Close()
}
