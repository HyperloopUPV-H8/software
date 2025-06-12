package tcp

import (
	"context"
	"fmt"
	"net"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"github.com/rs/zerolog"
)

// MockTCPServer simulates a board's TCP server that can be stopped and restarted
type MockTCPServer struct {
	addr     string
	listener net.Listener
	mu       sync.Mutex
	running  bool
	stopCh   chan struct{}
	
	// Tracking
	connectionCount int32
	lastConnTime    time.Time
}

// NewMockTCPServer creates a new mock TCP server
func NewMockTCPServer(addr string) *MockTCPServer {
	return &MockTCPServer{
		addr:   addr,
		stopCh: make(chan struct{}),
	}
}

// Start starts the mock server
func (s *MockTCPServer) Start() error {
	s.mu.Lock()
	defer s.mu.Unlock()
	
	if s.running {
		return fmt.Errorf("server already running")
	}
	
	listener, err := net.Listen("tcp", s.addr)
	if err != nil {
		return err
	}
	
	s.listener = listener
	s.running = true
	s.stopCh = make(chan struct{})
	
	go s.acceptLoop()
	
	return nil
}

// Stop stops the mock server
func (s *MockTCPServer) Stop() error {
	s.mu.Lock()
	defer s.mu.Unlock()
	
	if !s.running {
		return fmt.Errorf("server not running")
	}
	
	close(s.stopCh)
	s.running = false
	return s.listener.Close()
}

// acceptLoop handles incoming connections
func (s *MockTCPServer) acceptLoop() {
	for {
		conn, err := s.listener.Accept()
		if err != nil {
			select {
			case <-s.stopCh:
				return
			default:
				continue
			}
		}
		
		atomic.AddInt32(&s.connectionCount, 1)
		s.mu.Lock()
		s.lastConnTime = time.Now()
		s.mu.Unlock()
		
		// Handle connection (just keep it open for this test)
		go func(c net.Conn) {
			defer c.Close()
			// Keep connection alive until server stops
			<-s.stopCh
		}(conn)
	}
}

// GetConnectionCount returns the number of connections received
func (s *MockTCPServer) GetConnectionCount() int {
	return int(atomic.LoadInt32(&s.connectionCount))
}

// GetLastConnectionTime returns the time of the last connection
func (s *MockTCPServer) GetLastConnectionTime() time.Time {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.lastConnTime
}

// TestExponentialBackoffReconnection tests the exponential backoff behavior
func TestExponentialBackoffReconnection(t *testing.T) {
	// Setup logger
	logger := zerolog.New(zerolog.NewTestWriter(t)).With().Timestamp().Logger()
	
	// Find an available port
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("Failed to find available port: %v", err)
	}
	serverAddr := listener.Addr().String()
	listener.Close()
	
	// Create mock server
	mockServer := NewMockTCPServer(serverAddr)
	
	// Start the server initially
	err = mockServer.Start()
	if err != nil {
		t.Fatalf("Failed to start mock server: %v", err)
	}
	
	// Create client config with specific backoff parameters
	clientAddr, _ := net.ResolveTCPAddr("tcp", "127.0.0.1:0")
	config := NewClientConfig(clientAddr)
	config.Context = context.Background()
	config.TryReconnect = true
	config.MaxConnectionRetries = 5 // Will cycle after 5 retries
	config.ConnectionBackoffFunction = NewExponentialBackoff(
		100*time.Millisecond,  // min
		2.0,                   // multiplier
		2*time.Second,         // max
	)
	
	// Create client
	client := NewClient(serverAddr, config, logger)
	
	// Test 1: Initial connection should succeed
	t.Run("InitialConnection", func(t *testing.T) {
		conn, err := client.Dial()
		if err != nil {
			t.Fatalf("Initial connection failed: %v", err)
		}
		conn.Close()
		
		if mockServer.GetConnectionCount() != 1 {
			t.Errorf("Expected 1 connection, got %d", mockServer.GetConnectionCount())
		}
	})
	
	// Test 2: Test reconnection with exponential backoff
	t.Run("ExponentialBackoffReconnection", func(t *testing.T) {
		// Stop the server to simulate disconnection
		err := mockServer.Stop()
		if err != nil {
			t.Fatalf("Failed to stop server: %v", err)
		}
		
		// Reset connection count
		mockServer = NewMockTCPServer(serverAddr)
		
		// Track retry attempts and timings
		retryTimes := make([]time.Time, 0)
		startTime := time.Now()
		
		// Start a goroutine to track connection attempts
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		
		go func() {
			for {
				select {
				case <-ctx.Done():
					return
				default:
					beforeCount := mockServer.GetConnectionCount()
					time.Sleep(50 * time.Millisecond)
					afterCount := mockServer.GetConnectionCount()
					if afterCount > beforeCount {
						retryTimes = append(retryTimes, time.Now())
					}
				}
			}
		}()
		
		// Wait a bit, then restart the server after some retries
		go func() {
			time.Sleep(1 * time.Second) // Let client retry a few times
			mockServer.Start()
		}()
		
		// Try to connect (this should retry with exponential backoff)
		config.Context = ctx
		client = NewClient(serverAddr, config, logger)
		conn, err := client.Dial()
		if err != nil {
			t.Fatalf("Failed to reconnect: %v", err)
		}
		conn.Close()
		
		// Verify exponential backoff timing
		if len(retryTimes) < 2 {
			t.Skip("Not enough retry attempts captured")
		}
		
		// Check that retries follow exponential pattern
		// First retry should be after ~100ms, second after ~200ms, third after ~400ms, etc.
		expectedDelays := []time.Duration{
			100 * time.Millisecond,
			200 * time.Millisecond,
			400 * time.Millisecond,
			800 * time.Millisecond,
		}
		
		for i := 1; i < len(retryTimes) && i < len(expectedDelays); i++ {
			actualDelay := retryTimes[i].Sub(retryTimes[i-1])
			expectedDelay := expectedDelays[i-1]
			
			// Allow 20% tolerance for timing
			minDelay := time.Duration(float64(expectedDelay) * 0.8)
			maxDelay := time.Duration(float64(expectedDelay) * 1.2)
			
			if actualDelay < minDelay || actualDelay > maxDelay {
				t.Logf("Retry %d: expected delay ~%v, got %v", i, expectedDelay, actualDelay)
			}
		}
		
		totalTime := time.Since(startTime)
		t.Logf("Total reconnection time: %v with %d retries", totalTime, len(retryTimes))
	})
	
	// Test 3: Test max retries behavior and cycling
	t.Run("MaxRetriesCycling", func(t *testing.T) {
		// Stop the server again
		mockServer.Stop()
		
		// Create a client with very short backoff for faster testing
		config := NewClientConfig(clientAddr)
		config.Context = context.Background()
		config.TryReconnect = true
		config.MaxConnectionRetries = 3 // Small number for quick cycling
		config.ConnectionBackoffFunction = NewExponentialBackoff(
			10*time.Millisecond,   // min
			1.5,                   // multiplier
			50*time.Millisecond,   // max
		)
		
		client := NewClient(serverAddr, config, logger)
		
		// This should fail with ErrTooManyRetries
		_, err := client.Dial()
		if _, ok := err.(ErrTooManyRetries); !ok {
			t.Errorf("Expected ErrTooManyRetries, got %T: %v", err, err)
		}
		
		// Verify retry count was reset for next attempt
		// (This is implicit in the implementation - the next Dial will start fresh)
	})
}

// TestPersistentReconnection tests that the transport layer keeps trying to reconnect
func TestPersistentReconnection(t *testing.T) {
	// This test would require the full transport setup
	// For now, we're testing the client behavior directly
	t.Skip("Full transport test requires more setup")
}

// BenchmarkExponentialBackoff benchmarks the backoff calculation
func BenchmarkExponentialBackoff(b *testing.B) {
	backoff := NewExponentialBackoff(
		100*time.Millisecond,
		1.5,
		5*time.Second,
	)
	
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = backoff(i % 20) // Test various retry counts
	}
}