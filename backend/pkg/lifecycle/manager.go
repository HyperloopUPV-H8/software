package lifecycle

import (
	"context"
	"sync"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/process"
	"github.com/rs/zerolog"
)

type Manager struct {
	ctx              context.Context
	cancel           context.CancelFunc
	shutdownHandlers []func()
	connectedClients sync.WaitGroup
	isShuttingDown   bool
	mu               sync.Mutex
	logger           zerolog.Logger
	processManager   *process.ProcessManager
}

func NewManager(logger zerolog.Logger) *Manager {
	ctx, cancel := context.WithCancel(context.Background())
	return &Manager{
		ctx:            ctx,
		cancel:         cancel,
		logger:         logger.With().Str("component", "lifecycle").Logger(),
		processManager: process.NewProcessManager(logger),
	}
}

func (m *Manager) ClientConnected() {
	m.connectedClients.Add(1)
	m.logger.Debug().Msg("client connected")
}

func (m *Manager) ClientDisconnected() {
	m.connectedClients.Done()
	m.logger.Debug().Msg("client disconnected")
}

func (m *Manager) RegisterShutdownHandler(name string, handler func()) {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.logger.Info().Str("handler", name).Msg("registering shutdown handler")
	m.shutdownHandlers = append(m.shutdownHandlers, handler)
}

func (m *Manager) IsShuttingDown() bool {
	m.mu.Lock()
	defer m.mu.Unlock()
	return m.isShuttingDown
}

func (m *Manager) Shutdown(gracePeriod time.Duration) {
	m.mu.Lock()
	if m.isShuttingDown {
		m.mu.Unlock()
		m.logger.Warn().Msg("shutdown already in progress")
		return
	}
	m.isShuttingDown = true
	m.mu.Unlock()

	m.logger.Info().Dur("grace_period", gracePeriod).Msg("starting graceful shutdown")

	// Run shutdown handlers in reverse order
	for i := len(m.shutdownHandlers) - 1; i >= 0; i-- {
		m.shutdownHandlers[i]()
	}

	// Wait for clients to disconnect or timeout
	done := make(chan struct{})
	go func() {
		m.connectedClients.Wait()
		close(done)
	}()

	select {
	case <-done:
		m.logger.Info().Msg("all clients disconnected")
	case <-time.After(gracePeriod):
		m.logger.Warn().Msg("shutdown grace period exceeded")
	}

	m.cancel()
	m.logger.Info().Msg("shutdown complete")
}

func (m *Manager) Context() context.Context {
	return m.ctx
}

func (m *Manager) StartFrontends(workspaceRoot string, devControlStationPort, devEthernetViewPort int) error {
	m.logger.Info().Msg("starting frontend development servers")
	
	if err := m.processManager.StartFrontendServers(workspaceRoot, devControlStationPort, devEthernetViewPort); err != nil {
		return err
	}

	// Register shutdown handler for frontend processes
	m.RegisterShutdownHandler("frontends", func() {
		m.logger.Info().Msg("stopping frontend servers")
		m.processManager.StopAll()
	})

	return nil
}

func (m *Manager) GetFrontendURLs(devControlStationPort, devEthernetViewPort int) map[string]string {
	return m.processManager.GetFrontendURLs(devControlStationPort, devEthernetViewPort)
}

func (m *Manager) IsFrontendRunning(name string) bool {
	return m.processManager.IsRunning(name)
}