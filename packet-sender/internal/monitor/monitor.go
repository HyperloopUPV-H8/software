package monitor

import (
	"context"
	"fmt"
	"time"

	"packet_sender/internal/logger"
	"packet_sender/internal/simulator"
)

type Monitor struct {
	simulators []*simulator.BoardSimulator
	logger     logger.Logger
	stats      map[string]*BoardStats
}

type BoardStats struct {
	BoardName       string
	Connected       bool
	PacketsSent     int
	PacketsPerSec   float64
	LastPacketTime  time.Time
	Errors          int
	TotalBytes      int
	ConnectionTime  time.Time
	Uptime          time.Duration
}

func NewMonitor(simulators []*simulator.BoardSimulator, logger logger.Logger) *Monitor {
	return &Monitor{
		simulators: simulators,
		logger:     logger,
		stats:      make(map[string]*BoardStats),
	}
}

func (m *Monitor) Start(ctx context.Context) {
	m.logger.Info("Starting monitoring dashboard...")
	
	// Initialize stats for each simulator
	for _, sim := range m.simulators {
		boardName := sim.GetBoardName()
		m.stats[boardName] = &BoardStats{
			BoardName:      boardName,
			Connected:      false,
			ConnectionTime: time.Now(),
		}
	}
	
	// Start stats collection
	go m.collectStats(ctx)
	
	// Start display loop
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()
	
	for {
		select {
		case <-ctx.Done():
			m.logger.Info("Monitor shutting down...")
			return
		case <-ticker.C:
			m.displayStats()
		}
	}
}

func (m *Monitor) Stop() {
	m.logger.Info("Monitor stopped")
}

func (m *Monitor) collectStats(ctx context.Context) {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()
	
	prevCounts := make(map[string]int)
	
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			for _, sim := range m.simulators {
				boardName := sim.GetBoardName()
				stats, exists := m.stats[boardName]
				if !exists {
					continue
				}
				
				// Update connection status
				stats.Connected = sim.IsConnected()
				if stats.Connected {
					stats.Uptime = time.Since(stats.ConnectionTime)
				}
				
				// Collect packet stats
				packetCount := 0
				select {
				case stat := <-sim.GetStats():
					if stat.Success {
						packetCount++
						stats.LastPacketTime = stat.Timestamp
						stats.TotalBytes += stat.Size
					} else {
						stats.Errors++
					}
				default:
					// No new stats
				}
				
				// Calculate packets per second
				if prevCount, exists := prevCounts[boardName]; exists {
					stats.PacketsPerSec = float64(stats.PacketsSent - prevCount)
				}
				prevCounts[boardName] = stats.PacketsSent
				
				stats.PacketsSent += packetCount
			}
		}
	}
}

func (m *Monitor) displayStats() {
	// Clear screen (simple approach)
	fmt.Print("\033[2J\033[H")
	
	// Header
	fmt.Println("╔══════════════════════════════════════════════════════════════════════════════╗")
	fmt.Println("║                        HYPERLOOP PACKET SENDER MONITOR                       ║")
	fmt.Println("╠══════════════════════════════════════════════════════════════════════════════╣")
	fmt.Printf("║ Timestamp: %-65s ║\n", time.Now().Format("2006-01-02 15:04:05"))
	fmt.Println("╠══════════════════════════════════════════════════════════════════════════════╣")
	
	// Column headers
	fmt.Printf("║ %-12s │ %-10s │ %-8s │ %-6s │ %-8s │ %-6s │ %-8s ║\n",
		"Board", "Status", "Packets", "PPS", "Errors", "KB", "Uptime")
	fmt.Println("╠══════════════╪════════════╪══════════╪════════╪══════════╪════════╪══════════╣")
	
	// Board statistics
	totalPackets := 0
	totalErrors := 0
	connectedBoards := 0
	
	for _, stats := range m.stats {
		status := "DISCONNECTED"
		statusColor := "\033[31m" // Red
		if stats.Connected {
			status = "CONNECTED"
			statusColor = "\033[32m" // Green
			connectedBoards++
		}
		
		uptime := formatDuration(stats.Uptime)
		if !stats.Connected {
			uptime = "-"
		}
		
		fmt.Printf("║ %-12s │ %s%-10s\033[0m │ %-8d │ %-6.1f │ %-8d │ %-6d │ %-8s ║\n",
			stats.BoardName,
			statusColor, status,
			stats.PacketsSent,
			stats.PacketsPerSec,
			stats.Errors,
			stats.TotalBytes/1024,
			uptime)
		
		totalPackets += stats.PacketsSent
		totalErrors += stats.Errors
	}
	
	// Summary
	fmt.Println("╠══════════════╪════════════╪══════════╪════════╪══════════╪════════╪══════════╣")
	fmt.Printf("║ %-12s │ %-10s │ %-8d │ %-6s │ %-8d │ %-6s │ %-8s ║\n",
		"TOTAL", 
		fmt.Sprintf("%d/%d", connectedBoards, len(m.stats)),
		totalPackets,
		"-",
		totalErrors,
		"-",
		"-")
	
	fmt.Println("╚══════════════╧════════════╧══════════╧════════╧══════════╧════════╧══════════╝")
	
	// Legend
	fmt.Println("\nLegend:")
	fmt.Println("  Board    - Board name")
	fmt.Println("  Status   - Connection status")
	fmt.Println("  Packets  - Total packets sent")
	fmt.Println("  PPS      - Packets per second")
	fmt.Println("  Errors   - Failed packet transmissions")
	fmt.Println("  KB       - Total kilobytes sent")
	fmt.Println("  Uptime   - Connection uptime")
	
	fmt.Println("\nPress Ctrl+C to stop the monitor...")
}

func formatDuration(d time.Duration) string {
	if d < time.Minute {
		return fmt.Sprintf("%ds", int(d.Seconds()))
	} else if d < time.Hour {
		return fmt.Sprintf("%dm%ds", int(d.Minutes()), int(d.Seconds())%60)
	} else {
		return fmt.Sprintf("%dh%dm", int(d.Hours()), int(d.Minutes())%60)
	}
}

func (m *Monitor) GetBoardStats(boardName string) *BoardStats {
	if stats, exists := m.stats[boardName]; exists {
		return stats
	}
	return nil
}

func (m *Monitor) GetOverallStats() map[string]*BoardStats {
	result := make(map[string]*BoardStats)
	for name, stats := range m.stats {
		result[name] = stats
	}
	return result
}