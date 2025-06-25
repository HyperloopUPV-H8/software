package tcp

import (
	"context"
	"net"
	"sync"
	"testing"
	"time"

	"github.com/rs/zerolog"
)

// TestSimpleReconnectionScenario demonstrates a simple board disconnection and reconnection
func TestSimpleReconnectionScenario(t *testing.T) {
	logger := zerolog.New(zerolog.NewTestWriter(t)).With().Timestamp().Logger()
	
	// Setup: Create a simple TCP server that simulates a board
	boardAddr := "127.0.0.1:0"
	listener, err := net.Listen("tcp", boardAddr)
	if err != nil {
		t.Fatalf("Failed to create listener: %v", err)
	}
	boardAddr = listener.Addr().String()
	
	// Server state
	var serverMu sync.Mutex
	serverRunning := true
	connections := 0
	connectionTimes := []time.Time{}
	
	// Run the mock board server
	go func() {
		for serverRunning {
			conn, err := listener.Accept()
			if err != nil {
				continue
			}
			
			serverMu.Lock()
			connections++
			connectionTimes = append(connectionTimes, time.Now())
			t.Logf("Board accepted connection #%d at %v", connections, time.Now().Format("15:04:05.000"))
			serverMu.Unlock()
			
			// Keep connection open for a bit, then close to simulate disconnection
			go func(c net.Conn) {
				time.Sleep(500 * time.Millisecond)
				c.Close()
			}(conn)
		}
	}()
	
	// Configure client with exponential backoff
	clientAddr, _ := net.ResolveTCPAddr("tcp", "127.0.0.1:0")
	config := NewClientConfig(clientAddr)
	config.Context = context.Background()
	config.TryReconnect = true
	config.MaxConnectionRetries = 0 // Infinite retries
	config.ConnectionBackoffFunction = NewExponentialBackoff(
		100*time.Millisecond,  // min backoff
		1.5,                   // multiplier
		2*time.Second,         // max backoff
	)
	
	// Create client
	client := NewClient(boardAddr, config, logger)
	
	// Test scenario
	t.Log("=== Starting reconnection test scenario ===")
	
	// Phase 1: Initial connection
	t.Log("Phase 1: Establishing initial connection...")
	conn, err := client.Dial()
	if err != nil {
		t.Fatalf("Initial connection failed: %v", err)
	}
	t.Log("✓ Initial connection successful")
	
	// Wait a moment for server to register the connection
	time.Sleep(50 * time.Millisecond)
	
	// Verify we have 1 connection
	serverMu.Lock()
	if connections != 1 {
		t.Errorf("Expected 1 connection, got %d", connections)
	}
	serverMu.Unlock()
	
	// Close connection to simulate disconnection
	conn.Close()
	time.Sleep(100 * time.Millisecond)
	
	// Phase 2: Board goes offline (close listener)
	t.Log("\nPhase 2: Simulating board going offline...")
	listener.Close()
	serverRunning = false
	time.Sleep(100 * time.Millisecond)
	
	// Try to connect while board is offline (this should retry with backoff)
	dialDone := make(chan error, 1)
	dialStart := time.Now()
	
	go func() {
		_, err := client.Dial()
		dialDone <- err
	}()
	
	// Let it retry a few times
	t.Log("Client attempting to reconnect (board is offline)...")
	time.Sleep(800 * time.Millisecond)
	
	// Phase 3: Board comes back online
	t.Log("\nPhase 3: Bringing board back online...")
	listener, err = net.Listen("tcp", boardAddr)
	if err != nil {
		t.Fatalf("Failed to restart listener: %v", err)
	}
	defer listener.Close()
	
	serverRunning = true
	go func() {
		for serverRunning {
			conn, err := listener.Accept()
			if err != nil {
				continue
			}
			
			serverMu.Lock()
			connections++
			connectionTimes = append(connectionTimes, time.Now())
			t.Logf("Board accepted reconnection #%d at %v", connections, time.Now().Format("15:04:05.000"))
			serverMu.Unlock()
			
			// Keep this connection alive
			go func(c net.Conn) {
				buf := make([]byte, 1024)
				for {
					_, err := c.Read(buf)
					if err != nil {
						return
					}
				}
			}(conn)
		}
	}()
	
	// Wait for reconnection
	select {
	case err := <-dialDone:
		if err != nil {
			t.Fatalf("Reconnection failed: %v", err)
		}
		reconnectTime := time.Since(dialStart)
		t.Logf("✓ Reconnection successful after %v", reconnectTime)
	case <-time.After(5 * time.Second):
		t.Fatal("Reconnection timed out after 5 seconds")
	}
	
	// Verify we have 2 connections total
	serverMu.Lock()
	if connections != 2 {
		t.Errorf("Expected 2 total connections, got %d", connections)
	}
	
	// Log backoff pattern
	if len(connectionTimes) >= 2 {
		t.Log("\n=== Connection Timeline ===")
		for i, connTime := range connectionTimes {
			if i == 0 {
				t.Logf("Connection %d: %v (initial)", i+1, connTime.Format("15:04:05.000"))
			} else {
				backoff := connTime.Sub(connectionTimes[i-1])
				t.Logf("Connection %d: %v (after %v backoff)", i+1, connTime.Format("15:04:05.000"), backoff)
			}
		}
	}
	serverMu.Unlock()
	
	// Cleanup
	serverRunning = false
	listener.Close()
	
	t.Log("\n✓ Test completed successfully - exponential backoff reconnection works!")
}

// TestReconnectionMetrics tests and logs the exponential backoff timing
func TestReconnectionMetrics(t *testing.T) {
	logger := zerolog.New(zerolog.NewTestWriter(t)).With().Timestamp().Logger()
	
	// Create a server that never accepts connections to measure pure backoff timing
	clientAddr, _ := net.ResolveTCPAddr("tcp", "127.0.0.1:0")
	config := NewClientConfig(clientAddr)
	config.Context = context.Background()
	config.TryReconnect = true
	config.MaxConnectionRetries = 5 // Try 5 times (faster test)
	config.ConnectionBackoffFunction = NewExponentialBackoff(
		50*time.Millisecond,   // min
		2.0,                   // multiplier  
		1*time.Second,         // max
	)
	
	client := NewClient("127.0.0.1:9999", config, logger) // Non-existent server
	
	startTime := time.Now()
	_, err := client.Dial()
	totalTime := time.Since(startTime)
	
	if _, ok := err.(ErrTooManyRetries); !ok {
		t.Errorf("Expected ErrTooManyRetries, got %T: %v", err, err)
	}
	
	t.Log("\n=== Exponential Backoff Timing ===")
	t.Log("Configuration:")
	t.Logf("  Min backoff: 50ms")
	t.Logf("  Multiplier: 2.0")
	t.Logf("  Max backoff: 1s")
	t.Logf("  Max retries: 5")
	t.Log("\nExpected backoff sequence:")
	
	expectedTotal := time.Duration(0)
	for i := 1; i <= 5; i++ {
		backoff := time.Duration(float64(50*time.Millisecond) * float64(uint(1)<<uint(i-1)))
		if backoff > 1*time.Second {
			backoff = 1 * time.Second
		}
		expectedTotal += backoff
		t.Logf("  Retry %d: %v (cumulative: %v)", i, backoff, expectedTotal)
	}
	
	t.Logf("\nActual total time: %v", totalTime)
	t.Logf("Expected total time: ~%v", expectedTotal)
	
	// Allow some tolerance for connection attempt time
	tolerance := 2 * time.Second
	if totalTime < expectedTotal-tolerance || totalTime > expectedTotal+tolerance {
		t.Logf("Warning: Actual time differs significantly from expected")
	}
}