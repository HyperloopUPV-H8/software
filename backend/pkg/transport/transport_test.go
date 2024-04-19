package transport_test

import (
	transport_module "github.com/HyperloopUPV-H8/h9-backend/pkg/transport"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/tcp"
	"github.com/rs/zerolog"
	"net"
	"os"
	"testing"
)

func TestTransport(t *testing.T) {
	// Create server
	logger := zerolog.New(os.Stdout)
	transport := transport_module.NewTransport(logger)
	err := transport.HandleServer(tcp.NewServerConfig(), "127.0.0.1:8080")
	if err != nil {
		t.Errorf("Error creating server at 127.0.0.1:8080: %s", err)
	}

	// Create client
	addr, _ := net.ResolveTCPAddr("tcp", "127.0.0.1:3000")
	err = transport.HandleClient(tcp.NewClientConfig(addr), "127.0.0.1:8080")
	if err != nil {
		t.Errorf("Error creating client at 127.0.0.1:3000: %s", err)
	}

	// Create client with wrong address
	addr, _ = net.ResolveTCPAddr("tcp", "127.0.0.1:3030")
	err = transport.HandleClient(tcp.NewClientConfig(addr), "127.0.0.1:8000")
	if err == nil {
		t.Errorf("Expected error creating client at wrong address, got nil")
	}
}
