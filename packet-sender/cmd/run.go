package cmd

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	
	"packet_sender/internal/simulator"
	"packet_sender/internal/logger"
	"packet_sender/internal/monitor"
	"packet_sender/internal/utils"
)

// runCmd represents the run command
var runCmd = &cobra.Command{
	Use:   "run",
	Short: "Run the board simulator",
	Long: `Start the board simulator to recreate the behavior of boards declared in backend/cmd/config.toml.

The simulator maintains:
- Constant TCP connection with keepalive (1s interval)
- Automatic random UDP messages for data and enums
- Manual TCP protection messages (when enabled)

Examples:
  # Run all boards with default settings
  packet-sender run

  # Run specific boards
  packet-sender run --boards BCU,LCU

  # Run with custom backend address
  packet-sender run --backend-address 192.168.1.100

  # Run with protection simulation enabled
  packet-sender run --enable-protections

  # Run with monitoring dashboard
  packet-sender run --monitor`,
	RunE: runSimulator,
}

var (
	boards            []string
	backendAddress    string
	backendPort       int
	backendTCPPort    int
	packetInterval    time.Duration
	reconnectInterval time.Duration
	maxRetries        int
	enableProtections bool
	enableStates      bool
	enableOrders      bool
	enableMonitor     bool
	logLevel          string
)

func init() {
	rootCmd.AddCommand(runCmd)

	// Connection flags
	runCmd.Flags().StringSliceVarP(&boards, "boards", "b", []string{}, "boards to simulate (default: all)")
	runCmd.Flags().StringVarP(&backendAddress, "backend-address", "a", "127.0.0.9", "backend address")
	runCmd.Flags().IntVarP(&backendPort, "backend-port", "p", 8000, "backend UDP port")
	runCmd.Flags().IntVar(&backendTCPPort, "backend-tcp-port", 50500, "backend TCP port")
	// Protocol is now automatic: TCP for protections/keepalive, UDP for data/enums
	
	// Timing flags
	runCmd.Flags().DurationVarP(&packetInterval, "packet-interval", "i", 100*time.Millisecond, "packet generation interval")
	runCmd.Flags().DurationVar(&reconnectInterval, "reconnect-interval", 5*time.Second, "reconnection interval")
	runCmd.Flags().IntVar(&maxRetries, "max-retries", 10, "maximum connection retries")
	
	// Feature flags
	runCmd.Flags().BoolVar(&enableProtections, "enable-protections", false, "enable protection packet simulation")
	runCmd.Flags().BoolVar(&enableStates, "enable-states", false, "enable state transition simulation")
	runCmd.Flags().BoolVar(&enableOrders, "enable-orders", false, "enable order acknowledgment simulation")
	runCmd.Flags().BoolVar(&enableMonitor, "monitor", false, "enable real-time monitoring dashboard")
	
	// Logging flags
	runCmd.Flags().StringVar(&logLevel, "log-level", "info", "log level (debug, info, warn, error)")
	
	// Bind flags to viper
	viper.BindPFlag("boards", runCmd.Flags().Lookup("boards"))
	viper.BindPFlag("backend-address", runCmd.Flags().Lookup("backend-address"))
	viper.BindPFlag("backend-port", runCmd.Flags().Lookup("backend-port"))
	// Protocol binding removed - now automatic
	viper.BindPFlag("packet-interval", runCmd.Flags().Lookup("packet-interval"))
	viper.BindPFlag("reconnect-interval", runCmd.Flags().Lookup("reconnect-interval"))
	viper.BindPFlag("max-retries", runCmd.Flags().Lookup("max-retries"))
	viper.BindPFlag("enable-protections", runCmd.Flags().Lookup("enable-protections"))
	viper.BindPFlag("enable-states", runCmd.Flags().Lookup("enable-states"))
	viper.BindPFlag("enable-orders", runCmd.Flags().Lookup("enable-orders"))
	viper.BindPFlag("monitor", runCmd.Flags().Lookup("monitor"))
	viper.BindPFlag("log-level", runCmd.Flags().Lookup("log-level"))
}

func runSimulator(cmd *cobra.Command, args []string) error {
	// Load ADJ configuration
	adj, err := utils.LoadADJ()
	if err != nil {
		return fmt.Errorf("failed to load ADJ: %w", err)
	}
	
	// Create logger
	log := logger.NewLogger(logLevel)
	
	// Create configuration
	config := &simulator.Config{
		BackendAddress:     backendAddress,
		BackendPort:        backendPort,
		BackendTCPPort:     backendTCPPort,
		AutoReconnect:      true,
		ReconnectInterval:  reconnectInterval,
		MaxRetries:         maxRetries,
		PacketInterval:     packetInterval,
		EnableProtections:  enableProtections,
		EnableStateChanges: enableStates,
		EnableOrderAcks:    enableOrders,
		LogLevel:           logLevel,
	}
	
	// Filter boards if specified
	var targetBoards []string
	if len(boards) > 0 {
		targetBoards = boards
	} else {
		// Use all boards
		for _, board := range adj.Boards {
			targetBoards = append(targetBoards, board.Name)
		}
	}
	
	// Create board simulators
	simulators := make([]*simulator.BoardSimulator, 0)
	for _, board := range adj.Boards {
		// Skip if not in target boards
		found := false
		for _, target := range targetBoards {
			if board.Name == target {
				found = true
				break
			}
		}
		if !found {
			continue
		}
		
		sim := simulator.NewBoardSimulator(board, config, log)
		simulators = append(simulators, sim)
	}
	
	if len(simulators) == 0 {
		return fmt.Errorf("no boards to simulate")
	}
	
	// Create context for graceful shutdown
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	
	// Start monitoring if enabled
	var mon *monitor.Monitor
	if enableMonitor {
		mon = monitor.NewMonitor(simulators, log)
		go mon.Start(ctx)
	}
	
	// Start all simulators
	log.Info("Starting %d board simulators", len(simulators))
	for _, sim := range simulators {
		if err := sim.Start(); err != nil {
			return fmt.Errorf("failed to start simulator: %w", err)
		}
	}
	
	// Print startup information
	printStartupInfo(simulators, config, log)
	
	// Start statistics collection
	if !enableMonitor {
		go collectAndPrintStats(simulators, log)
	}
	
	// Wait for interrupt
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	
	select {
	case sig := <-sigChan:
		log.Info("Received signal %s, shutting down...", sig)
	case <-ctx.Done():
		log.Info("Context cancelled, shutting down...")
	}
	
	// Stop all simulators
	log.Info("Stopping board simulators...")
	for _, sim := range simulators {
		sim.Stop()
	}
	
	// Stop monitor if running
	if mon != nil {
		mon.Stop()
	}
	
	log.Info("Shutdown complete")
	return nil
}

func printStartupInfo(simulators []*simulator.BoardSimulator, config *simulator.Config, log logger.Logger) {
	log.Info("=== Packet Sender Started ===")
	log.Info("Backend: %s:%d (%s)", config.BackendAddress, config.BackendPort, config.Protocol)
	log.Info("Packet Interval: %v", config.PacketInterval)
	log.Info("Reconnect Interval: %v", config.ReconnectInterval)
	log.Info("Max Retries: %d", config.MaxRetries)
	log.Info("Features:")
	log.Info("  - Data packets: enabled")
	log.Info("  - Protection packets: %v", config.EnableProtections)
	log.Info("  - State transitions: %v", config.EnableStateChanges)
	log.Info("  - Order acknowledgments: %v", config.EnableOrderAcks)
	log.Info("Boards (%d):", len(simulators))
	for i, sim := range simulators {
		status := "starting"
		if sim.IsConnected() {
			status = "connected"
		}
		log.Info("  %d. %s (%s)", i+1, sim.GetBoardName(), status)
	}
	log.Info("============================")
}

func collectAndPrintStats(simulators []*simulator.BoardSimulator, log logger.Logger) {
	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()
	
	stats := make(map[string]int)
	
	for {
		select {
		case <-ticker.C:
			// Collect stats from all simulators
			for _, sim := range simulators {
				select {
				case stat := <-sim.GetStats():
					key := fmt.Sprintf("%s_%s", stat.BoardID, stat.PacketType)
					stats[key]++
				default:
					// No stats available
				}
			}
			
			// Print stats
			if len(stats) > 0 {
				log.Info("=== Statistics (last 10s) ===")
				for key, count := range stats {
					log.Info("%s: %d packets", key, count)
				}
				log.Info("============================")
				
				// Reset stats
				stats = make(map[string]int)
			}
		}
	}
}