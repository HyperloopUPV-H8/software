package transport_test

import (
	"context"
	"net"
	"os"
	"sync"
	"testing"
	"time"

	transport_module "github.com/HyperloopUPV-H8/h9-backend/pkg/transport"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/tcp"
	"github.com/rs/zerolog"
)

func TestTransport(t *testing.T) {
	logger := zerolog.New(os.Stdout)
	transport := transport_module.NewTransport(logger)

	// Create a context that cancels after a timeout
	ctx, cancel := context.WithTimeout(context.Background(), 12*time.Millisecond)
	defer cancel()

	var wg sync.WaitGroup

	wg.Add(1)
	go func() {
		defer wg.Done()
		err := transport.HandleServer(tcp.NewServerConfig(), "127.0.0.1:8080")
		if err != nil {
			t.Errorf("Error creating server at 127.0.0.1:8080: %s", err)
		}
	}()

	time.Sleep(10 * time.Millisecond)

	// Simulate client interaction
	addr, _ := net.ResolveTCPAddr("tcp", "127.0.0.1:3000")
	wg.Add(1)
	go func() {
		defer wg.Done()
		err := transport.HandleClient(tcp.NewClientConfig(addr), "127.0.0.1:8080")
		if err != nil {
			t.Errorf("Error creating client at 127.0.0.1:3000: %s", err)
		}
	}()

	// Create client with wrong address
	addr, _ = net.ResolveTCPAddr("tcp", "127.0.0.1:3030")
	wg.Add(1)
	go func() {
		defer wg.Done()
		err := transport.HandleClient(tcp.NewClientConfig(addr), "127.0.0.1:8000")
		if err == nil {
			t.Errorf("Expected error creating client at wrong address, got nil")
		}
	}()

	// Wait for context cancellation or error
	go func() {
		wg.Wait()
	}()

	<-ctx.Done() // Wait for timeout or manual cancel
	if ctx.Err() == context.DeadlineExceeded {
		t.Logf("Test completed by timeout")
	}
}
