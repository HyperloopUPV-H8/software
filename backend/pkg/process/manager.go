package process

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/rs/zerolog"
)

type ProcessManager struct {
	processes map[string]*exec.Cmd
	mu        sync.Mutex
	logger    zerolog.Logger
	ctx       context.Context
	cancel    context.CancelFunc
}

type ProcessConfig struct {
	Name        string
	WorkingDir  string
	Command     string
	Args        []string
	Port        int
	StartupTime time.Duration
}

func NewProcessManager(logger zerolog.Logger) *ProcessManager {
	ctx, cancel := context.WithCancel(context.Background())
	return &ProcessManager{
		processes: make(map[string]*exec.Cmd),
		logger:    logger.With().Str("component", "process_manager").Logger(),
		ctx:       ctx,
		cancel:    cancel,
	}
}

func (pm *ProcessManager) StartProcess(config ProcessConfig) error {
	pm.mu.Lock()
	defer pm.mu.Unlock()

	if _, exists := pm.processes[config.Name]; exists {
		return fmt.Errorf("process %s already running", config.Name)
	}

	// Create command with context for graceful shutdown
	cmd := exec.CommandContext(pm.ctx, config.Command, config.Args...)
	cmd.Dir = config.WorkingDir

	// Set up environment
	cmd.Env = os.Environ()

	// Create pipes for stdout/stderr
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return fmt.Errorf("failed to create stdout pipe for %s: %w", config.Name, err)
	}

	stderr, err := cmd.StderrPipe()
	if err != nil {
		return fmt.Errorf("failed to create stderr pipe for %s: %w", config.Name, err)
	}

	// Start the process
	if err := cmd.Start(); err != nil {
		return fmt.Errorf("failed to start %s: %w", config.Name, err)
	}

	pm.processes[config.Name] = cmd
	pm.logger.Info().
		Str("name", config.Name).
		Str("dir", config.WorkingDir).
		Str("command", config.Command).
		Strs("args", config.Args).
		Int("pid", cmd.Process.Pid).
		Msg("process started")

	// Start output readers
	go pm.readOutput(config.Name, "stdout", stdout)
	go pm.readOutput(config.Name, "stderr", stderr)

	// Monitor process
	go pm.monitorProcess(config.Name, cmd)

	// Wait for startup if specified
	if config.StartupTime > 0 {
		time.Sleep(config.StartupTime)
	}

	return nil
}

func (pm *ProcessManager) readOutput(name, stream string, reader io.ReadCloser) {
	defer reader.Close()
	scanner := bufio.NewScanner(reader)
	for scanner.Scan() {
		line := scanner.Text()
		pm.logger.Debug().
			Str("process", name).
			Str("stream", stream).
			Msg(line)
	}
}

func (pm *ProcessManager) monitorProcess(name string, cmd *exec.Cmd) {
	err := cmd.Wait()
	
	pm.mu.Lock()
	delete(pm.processes, name)
	pm.mu.Unlock()

	if err != nil {
		pm.logger.Error().
			Str("process", name).
			Err(err).
			Msg("process exited with error")
	} else {
		pm.logger.Info().
			Str("process", name).
			Msg("process exited normally")
	}
}

func (pm *ProcessManager) StopProcess(name string) error {
	pm.mu.Lock()
	defer pm.mu.Unlock()

	cmd, exists := pm.processes[name]
	if !exists {
		return fmt.Errorf("process %s not found", name)
	}

	pm.logger.Info().Str("process", name).Msg("stopping process")

	// Try graceful shutdown first
	if runtime.GOOS == "windows" {
		cmd.Process.Kill() // Windows doesn't support SIGTERM
	} else {
		cmd.Process.Signal(os.Interrupt)
	}

	// Wait for graceful shutdown with timeout
	done := make(chan error, 1)
	go func() {
		done <- cmd.Wait()
	}()

	select {
	case <-done:
		delete(pm.processes, name)
		pm.logger.Info().Str("process", name).Msg("process stopped gracefully")
		return nil
	case <-time.After(5 * time.Second):
		// Force kill
		cmd.Process.Kill()
		delete(pm.processes, name)
		pm.logger.Warn().Str("process", name).Msg("process force killed")
		return nil
	}
}

func (pm *ProcessManager) StopAll() {
	pm.mu.Lock()
	names := make([]string, 0, len(pm.processes))
	for name := range pm.processes {
		names = append(names, name)
	}
	pm.mu.Unlock()

	for _, name := range names {
		pm.StopProcess(name)
	}

	pm.cancel() // Cancel context to stop any remaining processes
}

func (pm *ProcessManager) IsRunning(name string) bool {
	pm.mu.Lock()
	defer pm.mu.Unlock()
	_, exists := pm.processes[name]
	return exists
}

func (pm *ProcessManager) GetRunningProcesses() []string {
	pm.mu.Lock()
	defer pm.mu.Unlock()
	
	names := make([]string, 0, len(pm.processes))
	for name := range pm.processes {
		names = append(names, name)
	}
	return names
}

// StartFrontendServers starts the development servers for frontends
func (pm *ProcessManager) StartFrontendServers(workspaceRoot string, devControlStationPort, devEthernetViewPort int) error {
	// Ensure common-front is built first
	commonFrontDir := filepath.Join(workspaceRoot, "common-front")
	if err := pm.buildCommonFront(commonFrontDir); err != nil {
		return fmt.Errorf("failed to build common-front: %w", err)
	}

	// Start control-station dev server
	controlStationDir := filepath.Join(workspaceRoot, "control-station")
	controlStationConfig := ProcessConfig{
		Name:        "control-station",
		WorkingDir:  controlStationDir,
		Command:     pm.getNpmCommand(),
		Args:        []string{"run", "dev", "--", "--port", fmt.Sprintf("%d", devControlStationPort), "--host", "127.0.0.1"},
		Port:        devControlStationPort,
		StartupTime: 3 * time.Second,
	}

	if err := pm.StartProcess(controlStationConfig); err != nil {
		return fmt.Errorf("failed to start control-station: %w", err)
	}

	// Start ethernet-view dev server
	ethernetViewDir := filepath.Join(workspaceRoot, "ethernet-view")
	ethernetViewConfig := ProcessConfig{
		Name:        "ethernet-view",
		WorkingDir:  ethernetViewDir,
		Command:     pm.getNpmCommand(),
		Args:        []string{"run", "dev", "--", "--port", fmt.Sprintf("%d", devEthernetViewPort), "--host", "127.0.0.1"},
		Port:        devEthernetViewPort,
		StartupTime: 3 * time.Second,
	}

	if err := pm.StartProcess(ethernetViewConfig); err != nil {
		return fmt.Errorf("failed to start ethernet-view: %w", err)
	}

	return nil
}

func (pm *ProcessManager) buildCommonFront(commonFrontDir string) error {
	pm.logger.Info().Msg("building common-front library")
	
	cmd := exec.Command(pm.getNpmCommand(), "run", "build")
	cmd.Dir = commonFrontDir
	
	output, err := cmd.CombinedOutput()
	if err != nil {
		pm.logger.Error().
			Err(err).
			Str("output", string(output)).
			Msg("failed to build common-front")
		return err
	}
	
	pm.logger.Info().Msg("common-front built successfully")
	return nil
}

func (pm *ProcessManager) getNpmCommand() string {
	if runtime.GOOS == "windows" {
		return "npm.cmd"
	}
	return "npm"
}

// GetFrontendURLs returns the URLs for frontend servers
func (pm *ProcessManager) GetFrontendURLs(devControlStationPort, devEthernetViewPort int) map[string]string {
	return map[string]string{
		"control-station": fmt.Sprintf("http://127.0.0.1:%d", devControlStationPort),
		"ethernet-view":   fmt.Sprintf("http://127.0.0.1:%d", devEthernetViewPort),
	}
}

// extractPort extracts the port number from an address string like "127.0.0.1:4000"
func (pm *ProcessManager) extractPort(addr string) int {
	parts := strings.Split(addr, ":")
	if len(parts) != 2 {
		pm.logger.Warn().Str("address", addr).Msg("invalid address format, using default port")
		return 3000
	}
	
	port, err := strconv.Atoi(parts[1])
	if err != nil {
		pm.logger.Warn().Str("address", addr).Err(err).Msg("invalid port number, using default")
		return 3000
	}
	
	return port
}