package cmd

import (
	"bufio"
	"encoding/binary"
	"fmt"
	"math"
	"math/rand"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/spf13/cobra"
	adj_module "github.com/HyperloopUPV-H8/h9-backend/pkg/adj"
	"packet_sender/internal/logger"
	"packet_sender/internal/simulator"
	"packet_sender/internal/utils"
)

var interactiveCmd = &cobra.Command{
	Use:   "interactive",
	Short: "Interactive packet sending mode (default)",
	Long: `Start an interactive CLI for manual packet sending.

This is the default mode when running packet-sender without arguments.

This mode allows you to:
- Run random packet generation
- Send specific packets with custom or random values
- Send manual protection packets with severity levels

Example:
  packet-sender                    (runs interactive mode by default)
  packet-sender interactive
  packet-sender interactive --board BCU`,
	RunE: runInteractive,
}

var (
	interactiveBoard string
)

func init() {
	rootCmd.AddCommand(interactiveCmd)
	interactiveCmd.Flags().StringVar(&interactiveBoard, "board", "", "specific board to use (default: prompt for selection)")
	
	// Add backend connection flags for interactive mode
	interactiveCmd.Flags().StringVarP(&backendAddress, "backend-address", "a", "127.0.0.9", "backend address")
	interactiveCmd.Flags().IntVarP(&backendPort, "backend-port", "p", 8000, "backend UDP port")
	interactiveCmd.Flags().IntVar(&backendTCPPort, "backend-tcp-port", 50500, "backend TCP port")
	
	// Also add the same flags to root command for when packet-sender is run without subcommand
	rootCmd.Flags().StringVarP(&backendAddress, "backend-address", "a", "127.0.0.9", "backend address")
	rootCmd.Flags().IntVarP(&backendPort, "backend-port", "p", 8000, "backend UDP port")
	rootCmd.Flags().IntVar(&backendTCPPort, "backend-tcp-port", 50500, "backend TCP port")
}

func runInteractive(cmd *cobra.Command, args []string) error {
	// Load ADJ configuration
	adj, err := utils.LoadADJ()
	if err != nil {
		return fmt.Errorf("failed to load ADJ: %w", err)
	}

	// Create logger
	log := logger.NewLogger("info")

	fmt.Println("\n🚀 Interactive Packet Sender")
	fmt.Println("========================================")

	// Main interactive loop
	scanner := bufio.NewScanner(os.Stdin)
	for {
		fmt.Println("\n📋 Main Menu:")
		fmt.Println("1. Send random messages")
		fmt.Println("2. Send manual message")
		fmt.Println("3. Send protection message")
		fmt.Println("4. Exit")
		fmt.Print("\nSelect option (1-4): ")

		if !scanner.Scan() {
			break
		}

		option := strings.TrimSpace(scanner.Text())
		switch option {
		case "1":
			if err := sendRandomMessages(&adj, log, scanner); err != nil {
				fmt.Printf("❌ Error: %v\n", err)
			}
		case "2":
			if err := sendManualMessage(&adj, log, scanner); err != nil {
				fmt.Printf("❌ Error: %v\n", err)
			}
		case "3":
			if err := sendProtectionMessage(&adj, log, scanner); err != nil {
				fmt.Printf("❌ Error: %v\n", err)
			}
		case "4":
			fmt.Println("\n👋 Goodbye!")
			return nil
		default:
			fmt.Println("❌ Invalid option. Please select 1-4.")
		}
	}

	return nil
}

func selectBoard(boards []adj_module.Board) (adj_module.Board, error) {
	fmt.Println("\n📦 Available Boards:")
	for i, board := range boards {
		fmt.Printf("%d. %s (IP: %s)\n", i+1, board.Name, board.IP)
	}

	scanner := bufio.NewScanner(os.Stdin)
	fmt.Printf("\nSelect board (1-%d): ", len(boards))
	if !scanner.Scan() {
		return adj_module.Board{}, fmt.Errorf("no input")
	}

	index, err := strconv.Atoi(strings.TrimSpace(scanner.Text()))
	if err != nil || index < 1 || index > len(boards) {
		return adj_module.Board{}, fmt.Errorf("invalid selection")
	}

	return boards[index-1], nil
}

func createAndConnectSimulator(board adj_module.Board, log logger.Logger) (*simulator.BoardSimulator, error) {
	return createAndConnectSimulatorWithConfig(board, log, true, true, true)
}

func createAndConnectSimulatorWithConfig(board adj_module.Board, log logger.Logger, enableProtections, enableStateChanges, enableOrderAcks bool) (*simulator.BoardSimulator, error) {
	// Create simulator config
	config := &simulator.Config{
		BackendAddress:     backendAddress,
		BackendPort:        backendPort,
		BackendTCPPort:     backendTCPPort,
		AutoReconnect:      true,
		ReconnectInterval:  time.Second,
		MaxRetries:         3,
		PacketInterval:     100 * time.Millisecond,
		EnableProtections:  enableProtections,
		EnableStateChanges: enableStateChanges,
		EnableOrderAcks:    enableOrderAcks,
		LogLevel:           "warn",
	}

	// Create and start simulator
	sim := simulator.NewBoardSimulator(board, config, log)
	if err := sim.Start(); err != nil {
		return nil, fmt.Errorf("failed to start simulator: %w", err)
	}

	// Wait for connection
	fmt.Printf("\nConnecting to backend for board %s...\n", board.Name)
	fmt.Printf("  Board IP: %s\n", board.IP)
	fmt.Printf("  Backend: %s (UDP:%d, TCP:%d)\n", config.BackendAddress, config.BackendPort, config.BackendTCPPort)
	
	connected := false
	for i := 0; i < 30; i++ {
		if sim.IsConnected() {
			connected = true
			fmt.Println("  ✓ Connected!")
			break
		}
		fmt.Print(".")
		time.Sleep(100 * time.Millisecond)
	}
	if !connected {
		sim.Stop()
		return nil, fmt.Errorf("failed to connect to backend")
	}

	return sim, nil
}

func createAndConnectSimulatorManualMode(board adj_module.Board, log logger.Logger) (*simulator.BoardSimulator, error) {
	// Create simulator config with manual mode enabled
	config := &simulator.Config{
		BackendAddress:     backendAddress,
		BackendPort:        backendPort,
		BackendTCPPort:     backendTCPPort,
		AutoReconnect:      true,
		ReconnectInterval:  time.Second,
		MaxRetries:         3,
		PacketInterval:     100 * time.Millisecond, // Not used in manual mode
		EnableProtections:  false,
		EnableStateChanges: false,
		EnableOrderAcks:    false,
		ManualMode:         true, // Disable automatic packet generation
		LogLevel:           "info", // Show connection details
	}

	// Create and start simulator
	sim := simulator.NewBoardSimulator(board, config, log)
	if err := sim.Start(); err != nil {
		return nil, fmt.Errorf("failed to start simulator: %w", err)
	}

	// Wait for connection
	fmt.Printf("\nConnecting to backend for board %s...\n", board.Name)
	fmt.Printf("  Board IP: %s\n", board.IP)
	fmt.Printf("  Backend: %s (UDP:%d, TCP:%d)\n", config.BackendAddress, config.BackendPort, config.BackendTCPPort)
	
	// For manual mode, we only need UDP connection for data packets
	// TCP is only needed for protection packets
	connected := false
	for i := 0; i < 30; i++ {
		// Check if at least UDP is connected (since we're mainly sending data packets)
		if sim.IsUDPConnected() {
			connected = true
			fmt.Println("  ✓ Connected (UDP ready)!")
			if !sim.IsConnected() {
				fmt.Println("  ⚠️  Note: TCP not connected - protection packets won't work")
			}
			break
		}
		fmt.Print(".")
		time.Sleep(100 * time.Millisecond)
	}
	if !connected {
		sim.Stop()
		return nil, fmt.Errorf("failed to connect to backend (no UDP connection)")
	}

	return sim, nil
}

func sendRandomMessages(adj *adj_module.ADJ, log logger.Logger, scanner *bufio.Scanner) error {
	// Select message types
	fmt.Println("\n🎲 Random Message Generation")
	fmt.Println("\nSelect message types to send (comma-separated numbers):")
	fmt.Println("1. Data packets")
	fmt.Println("2. Protection packets")
	fmt.Println("3. State packets")
	fmt.Println("4. Order packets")
	fmt.Print("\nSelect types (e.g., 1,2,4): ")

	if !scanner.Scan() {
		return fmt.Errorf("no input")
	}

	selectedTypes := make(map[string]bool)
	typeInput := strings.TrimSpace(scanner.Text())
	typeNumbers := strings.Split(typeInput, ",")
	for _, num := range typeNumbers {
		num = strings.TrimSpace(num)
		switch num {
		case "1":
			selectedTypes["data"] = true
		case "2":
			selectedTypes["protection"] = true
		case "3":
			selectedTypes["state"] = true
		case "4":
			selectedTypes["order"] = true
		}
	}

	if len(selectedTypes) == 0 {
		return fmt.Errorf("no message types selected")
	}

	// Select board
	var boardList []adj_module.Board
	for _, b := range adj.Boards {
		boardList = append(boardList, b)
	}
	board, err := selectBoard(boardList)
	if err != nil {
		return err
	}

	// Create and connect simulator with automatic generation disabled
	// We'll manually control packet generation
	sim, err := createAndConnectSimulatorManualMode(board, log)
	if err != nil {
		return err
	}
	defer sim.Stop()

	// Start random generation
	return runRandomGenerationWithTypes(sim, board, selectedTypes, scanner)
}

func runRandomGenerationWithTypes(sim *simulator.BoardSimulator, board adj_module.Board, selectedTypes map[string]bool, scanner *bufio.Scanner) error {
	fmt.Println("\n🎲 Random Packet Generation")
	fmt.Print("Duration in seconds (0 for continuous): ")
	
	if !scanner.Scan() {
		return fmt.Errorf("no input")
	}

	duration, err := strconv.Atoi(strings.TrimSpace(scanner.Text()))
	if err != nil {
		return fmt.Errorf("invalid duration")
	}

	fmt.Print("Packet interval in ms (default 100): ")
	if !scanner.Scan() {
		return fmt.Errorf("no input")
	}

	intervalStr := strings.TrimSpace(scanner.Text())
	interval := 100
	if intervalStr != "" {
		interval, err = strconv.Atoi(intervalStr)
		if err != nil {
			return fmt.Errorf("invalid interval")
		}
	}

	// Start random generation
	fmt.Printf("\n▶️  Starting random generation (interval: %dms)\n", interval)
	fmt.Printf("Sending types: ")
	var types []string
	if selectedTypes["data"] {
		types = append(types, "data")
	}
	if selectedTypes["protection"] {
		types = append(types, "protection")
	}
	if selectedTypes["state"] {
		types = append(types, "state")
	}
	if selectedTypes["order"] {
		types = append(types, "order")
	}
	fmt.Printf("%s\n", strings.Join(types, ", "))
	fmt.Println("Press Enter to stop...")

	stopChan := make(chan bool)
	go func() {
		scanner.Scan()
		stopChan <- true
	}()

	ticker := time.NewTicker(time.Duration(interval) * time.Millisecond)
	defer ticker.Stop()

	start := time.Now()
	packetCount := 0
	typeCounts := make(map[string]int)

	for {
		select {
		case <-stopChan:
			fmt.Printf("\n⏹️  Stopped. Sent %d packets in %v\n", packetCount, time.Since(start))
			for t, count := range typeCounts {
				fmt.Printf("  - %s: %d\n", t, count)
			}
			return nil
		case <-ticker.C:
			// Select a random type from selected types
			var availableTypes []string
			for t := range selectedTypes {
				availableTypes = append(availableTypes, t)
			}
			
			if len(availableTypes) == 0 {
				continue
			}
			
			// Pick random type
			packetType := availableTypes[rand.Intn(len(availableTypes))]
			
			var packet []byte
			switch packetType {
			case "data":
				packet = generateRandomDataPacket(board)
			case "protection":
				// Generate random protection packet
				severity := uint8(rand.Intn(3)) // 0=OK, 1=WARNING, 2=FAULT
				packet = createTestProtectionPacket(severity)
			case "state":
				// For now, just skip state packets (would need more complex implementation)
				continue
			case "order":
				// For now, just skip order packets (would need more complex implementation)
				continue
			}
			
			if packet != nil {
				sim.SendPacket(packet)
				packetCount++
				typeCounts[packetType]++
				fmt.Printf("\r📤 Sent %d packets", packetCount)
			}
			
			if duration > 0 && time.Since(start) > time.Duration(duration)*time.Second {
				fmt.Printf("\n⏹️  Duration reached. Sent %d packets\n", packetCount)
				for t, count := range typeCounts {
					fmt.Printf("  - %s: %d\n", t, count)
				}
				return nil
			}
		}
	}
}

func sendManualMessage(adj *adj_module.ADJ, log logger.Logger, scanner *bufio.Scanner) error {
	// Select board
	var boardList []adj_module.Board
	for _, b := range adj.Boards {
		boardList = append(boardList, b)
	}
	board, err := selectBoard(boardList)
	if err != nil {
		return err
	}

	// Create and connect simulator
	sim, err := createAndConnectSimulator(board, log)
	if err != nil {
		return err
	}
	defer sim.Stop()

	// Send specific packet
	return sendSpecificPacket(sim, board, scanner)
}

func sendSpecificPacket(sim *simulator.BoardSimulator, board adj_module.Board, scanner *bufio.Scanner) error {
	// Filter data packets
	var dataPackets []adj_module.Packet
	for _, p := range board.Packets {
		if p.Type == "data" {
			dataPackets = append(dataPackets, p)
		}
	}

	if len(dataPackets) == 0 {
		return fmt.Errorf("no data packets available for board %s", board.Name)
	}

	// Select packet
	fmt.Println("\n📊 Available Data Packets:")
	for i, p := range dataPackets {
		fmt.Printf("%d. %s (ID: %d, %d values)\n", i+1, p.Name, p.Id, len(p.Variables))
	}

	fmt.Printf("\nSelect packet (1-%d): ", len(dataPackets))
	if !scanner.Scan() {
		return fmt.Errorf("no input")
	}

	index, err := strconv.Atoi(strings.TrimSpace(scanner.Text()))
	if err != nil || index < 1 || index > len(dataPackets) {
		return fmt.Errorf("invalid selection")
	}

	selectedPacket := dataPackets[index-1]

	// Ask for value type
	fmt.Println("\nValue selection:")
	fmt.Println("1. Random values")
	fmt.Println("2. Custom values")
	fmt.Print("Select option (1-2): ")

	if !scanner.Scan() {
		return fmt.Errorf("no input")
	}

	valueOption := strings.TrimSpace(scanner.Text())
	
	var packet []byte
	if valueOption == "1" {
		packet = generateRandomPacketData(selectedPacket)
	} else if valueOption == "2" {
		packet, err = generateCustomPacketData(selectedPacket, scanner)
		if err != nil {
			return err
		}
	} else {
		return fmt.Errorf("invalid option")
	}

	// Send packet
	sim.SendPacket(packet)
	fmt.Printf("✅ Sent packet '%s' (ID: %d, %d bytes)\n", selectedPacket.Name, selectedPacket.Id, len(packet))
	
	return nil
}

func sendProtectionMessage(adj *adj_module.ADJ, log logger.Logger, scanner *bufio.Scanner) error {
	// Select severity
	fmt.Println("\n🛡️  Protection Message")
	fmt.Println("\nSelect severity:")
	fmt.Println("1. OK")
	fmt.Println("2. WARN")
	fmt.Println("3. FAULT")
	fmt.Print("\nSelect severity (1-3): ")

	if !scanner.Scan() {
		return fmt.Errorf("no input")
	}

	severityOption := strings.TrimSpace(scanner.Text())
	var severity uint8
	var severityName string
	switch severityOption {
	case "1":
		severity = 0 // OK
		severityName = "OK"
	case "2":
		severity = 1 // WARNING
		severityName = "WARN"
	case "3":
		severity = 2 // FAULT
		severityName = "FAULT"
	default:
		return fmt.Errorf("invalid severity")
	}

	// Select board
	var boardList []adj_module.Board
	for _, b := range adj.Boards {
		boardList = append(boardList, b)
	}
	board, err := selectBoard(boardList)
	if err != nil {
		return err
	}

	// Create and connect simulator
	sim, err := createAndConnectSimulator(board, log)
	if err != nil {
		return err
	}
	defer sim.Stop()

	// Create and send protection packet with "TEST" message
	packet := createTestProtectionPacket(severity)
	sim.SendPacket(packet)
	
	fmt.Printf("✅ Sent protection message with severity: %s and message: \"TEST\"\n", severityName)
	
	return nil
}

func sendInteractiveProtectionPacket(sim *simulator.BoardSimulator, board adj_module.Board, scanner *bufio.Scanner) error {
	fmt.Println("\n🛡️  Protection Packet")
	fmt.Println("Severity levels:")
	fmt.Println("1. FAULT")
	fmt.Println("2. WARNING")
	fmt.Println("3. OK")
	fmt.Print("Select severity (1-3): ")

	if !scanner.Scan() {
		return fmt.Errorf("no input")
	}

	severityOption := strings.TrimSpace(scanner.Text())
	var severity uint8
	switch severityOption {
	case "1":
		severity = 2 // FAULT
	case "2":
		severity = 1 // WARNING
	case "3":
		severity = 0 // OK
	default:
		return fmt.Errorf("invalid severity")
	}

	// Create protection packet
	packet := createTestProtectionPacket(severity)
	
	// Send packet
	sim.SendPacket(packet)
	
	severityNames := []string{"OK", "WARNING", "FAULT"}
	fmt.Printf("✅ Sent protection packet with severity: %s\n", severityNames[severity])
	
	return nil
}

func generateRandomDataPacket(board adj_module.Board) []byte {
	// Get random data packet
	var dataPackets []adj_module.Packet
	for _, p := range board.Packets {
		if p.Type == "data" {
			dataPackets = append(dataPackets, p)
		}
	}
	
	if len(dataPackets) == 0 {
		return nil
	}
	
	packet := dataPackets[rand.Intn(len(dataPackets))]
	return generateRandomPacketData(packet)
}

func generateRandomPacketData(packet adj_module.Packet) []byte {
	buf := make([]byte, 2)
	binary.LittleEndian.PutUint16(buf, packet.Id)
	
	for _, variable := range packet.Variables {
		switch {
		case strings.Contains(variable.Type, "enum"):
			// Parse enum options from type string like "enum(option1,option2)"
			options := parseEnumOptions(variable.Type)
			if len(options) > 0 {
				buf = append(buf, uint8(rand.Intn(len(options))))
			} else {
				// Default to 0 if no enum options found
				fmt.Printf("Warning: Empty enum type '%s' for variable '%s', defaulting to 0\n", variable.Type, variable.Name)
				buf = append(buf, 0)
			}
		case variable.Type == "uint8":
			buf = append(buf, uint8(rand.Intn(256)))
		case variable.Type == "uint16":
			b := make([]byte, 2)
			binary.LittleEndian.PutUint16(b, uint16(rand.Intn(65536)))
			buf = append(buf, b...)
		case variable.Type == "uint32":
			b := make([]byte, 4)
			binary.LittleEndian.PutUint32(b, rand.Uint32())
			buf = append(buf, b...)
		case variable.Type == "uint64":
			b := make([]byte, 8)
			binary.LittleEndian.PutUint64(b, rand.Uint64())
			buf = append(buf, b...)
		case variable.Type == "int8":
			buf = append(buf, uint8(rand.Intn(256)))
		case variable.Type == "int16":
			b := make([]byte, 2)
			binary.LittleEndian.PutUint16(b, uint16(rand.Intn(65536)))
			buf = append(buf, b...)
		case variable.Type == "int32":
			b := make([]byte, 4)
			binary.LittleEndian.PutUint32(b, rand.Uint32())
			buf = append(buf, b...)
		case variable.Type == "int64":
			b := make([]byte, 8)
			binary.LittleEndian.PutUint64(b, rand.Uint64())
			buf = append(buf, b...)
		case variable.Type == "float32":
			b := make([]byte, 4)
			binary.LittleEndian.PutUint32(b, math.Float32bits(rand.Float32()*100))
			buf = append(buf, b...)
		case variable.Type == "float64":
			b := make([]byte, 8)
			binary.LittleEndian.PutUint64(b, math.Float64bits(rand.Float64()*100))
			buf = append(buf, b...)
		case variable.Type == "bool":
			if rand.Intn(2) == 1 {
				buf = append(buf, 1)
			} else {
				buf = append(buf, 0)
			}
		}
	}
	
	return buf
}

func generateCustomPacketData(packet adj_module.Packet, scanner *bufio.Scanner) ([]byte, error) {
	buf := make([]byte, 2)
	binary.LittleEndian.PutUint16(buf, packet.Id)
	
	fmt.Printf("\nEnter values for packet '%s':\n", packet.Name)
	
	for _, variable := range packet.Variables {
		for {
			fmt.Printf("%s (%s): ", variable.Name, variable.Type)
			
			if !scanner.Scan() {
				return nil, fmt.Errorf("no input")
			}
			
			input := strings.TrimSpace(scanner.Text())
			var parseErr error
			
			switch variable.Type {
			case "uint8":
				v, err := strconv.ParseUint(input, 10, 8)
				if err != nil {
					parseErr = fmt.Errorf("invalid uint8 value (0-255): %v", err)
				} else {
					buf = append(buf, uint8(v))
				}
			case "uint16":
				v, err := strconv.ParseUint(input, 10, 16)
				if err != nil {
					parseErr = fmt.Errorf("invalid uint16 value (0-65535): %v", err)
				} else {
					b := make([]byte, 2)
					binary.LittleEndian.PutUint16(b, uint16(v))
					buf = append(buf, b...)
				}
			case "uint32":
				v, err := strconv.ParseUint(input, 10, 32)
				if err != nil {
					parseErr = fmt.Errorf("invalid uint32 value (0-4294967295): %v", err)
				} else {
					b := make([]byte, 4)
					binary.LittleEndian.PutUint32(b, uint32(v))
					buf = append(buf, b...)
				}
			case "uint64":
				v, err := strconv.ParseUint(input, 10, 64)
				if err != nil {
					parseErr = fmt.Errorf("invalid uint64 value: %v", err)
				} else {
					b := make([]byte, 8)
					binary.LittleEndian.PutUint64(b, v)
					buf = append(buf, b...)
				}
			case "int8":
				v, err := strconv.ParseInt(input, 10, 8)
				if err != nil {
					parseErr = fmt.Errorf("invalid int8 value (-128 to 127): %v", err)
				} else {
					buf = append(buf, uint8(v))
				}
			case "int16":
				v, err := strconv.ParseInt(input, 10, 16)
				if err != nil {
					parseErr = fmt.Errorf("invalid int16 value (-32768 to 32767): %v", err)
				} else {
					b := make([]byte, 2)
					binary.LittleEndian.PutUint16(b, uint16(v))
					buf = append(buf, b...)
				}
			case "int32":
				v, err := strconv.ParseInt(input, 10, 32)
				if err != nil {
					parseErr = fmt.Errorf("invalid int32 value: %v", err)
				} else {
					b := make([]byte, 4)
					binary.LittleEndian.PutUint32(b, uint32(v))
					buf = append(buf, b...)
				}
			case "int64":
				v, err := strconv.ParseInt(input, 10, 64)
				if err != nil {
					parseErr = fmt.Errorf("invalid int64 value: %v", err)
				} else {
					b := make([]byte, 8)
					binary.LittleEndian.PutUint64(b, uint64(v))
					buf = append(buf, b...)
				}
			case "float32":
				v, err := strconv.ParseFloat(input, 32)
				if err != nil {
					parseErr = fmt.Errorf("invalid float32 value: %v", err)
				} else {
					b := make([]byte, 4)
					binary.LittleEndian.PutUint32(b, math.Float32bits(float32(v)))
					buf = append(buf, b...)
				}
			case "float64":
				v, err := strconv.ParseFloat(input, 64)
				if err != nil {
					parseErr = fmt.Errorf("invalid float64 value: %v", err)
				} else {
					b := make([]byte, 8)
					binary.LittleEndian.PutUint64(b, math.Float64bits(v))
					buf = append(buf, b...)
				}
			case "bool":
				if input == "true" || input == "1" {
					buf = append(buf, 1)
				} else if input == "false" || input == "0" {
					buf = append(buf, 0)
				} else {
					parseErr = fmt.Errorf("invalid bool value (use true/false or 1/0)")
				}
			default:
				if strings.Contains(variable.Type, "enum") {
					// Parse enum options and try to match by name or index
					options := parseEnumOptions(variable.Type)
					found := false
					for i, opt := range options {
						if opt == input || strconv.Itoa(i) == input {
							buf = append(buf, uint8(i))
							found = true
							break
						}
					}
					if !found {
						parseErr = fmt.Errorf("invalid enum option: %s (available: %v)", input, options)
					}
				} else {
					parseErr = fmt.Errorf("unknown type: %s", variable.Type)
				}
			}
			
			if parseErr != nil {
				fmt.Printf("❌ %v\n", parseErr)
				continue // Retry input for this variable
			}
			break // Move to next variable
		}
	}
	
	return buf, nil
}

func createTestProtectionPacket(severity uint8) []byte {
	// Protection packet format:
	// |========|========|========|========|
	// |   id   |   id   |  type  |  kind  |
	// |========|========|========|========|
	// |  name  |  name  |  ...   |  0x00  | (null-terminated string)
	// |========|========|========|========|
	// |  data  |  data  |  data  |  data  | (protection-specific data)
	// |========|========|========|========|
	// |counter |counter | second | minute |
	// |========|========|========|========|
	// |  hour  |  day   | month  |  year  |
	// |========|========|========|========|
	// |  year  |
	// |========|
	
	buf := make([]byte, 2)
	binary.LittleEndian.PutUint16(buf, 0x8000) // Protection packet ID
	
	buf = append(buf, severity) // Type (0=OK, 1=WARNING, 2=FAULT)
	buf = append(buf, 0)        // Kind (0=Below)
	
	// Name (null-terminated)
	name := "TEST"
	buf = append(buf, []byte(name)...)
	buf = append(buf, 0) // null terminator
	
	// Protection data (varies by kind, using simple data for test)
	// For Below kind: value (float32) + bound (float32)
	valueBuf := make([]byte, 4)
	binary.LittleEndian.PutUint32(valueBuf, math.Float32bits(42.0))
	buf = append(buf, valueBuf...)
	
	boundBuf := make([]byte, 4)
	binary.LittleEndian.PutUint32(boundBuf, math.Float32bits(50.0))
	buf = append(buf, boundBuf...)
	
	// Timestamp
	now := time.Now()
	counter := make([]byte, 2)
	binary.LittleEndian.PutUint16(counter, 0)
	buf = append(buf, counter...)
	
	buf = append(buf, uint8(now.Second()))
	buf = append(buf, uint8(now.Minute()))
	buf = append(buf, uint8(now.Hour()))
	buf = append(buf, uint8(now.Day()))
	buf = append(buf, uint8(now.Month()))
	
	year := make([]byte, 2)
	binary.LittleEndian.PutUint16(year, uint16(now.Year()))
	buf = append(buf, year...)
	
	return buf
}

// parseEnumOptions extracts enum options from a type string like "enum(option1,option2,option3)"
func parseEnumOptions(enumType string) []string {
	if !strings.HasPrefix(enumType, "enum(") || !strings.HasSuffix(enumType, ")") {
		return nil
	}
	
	content := strings.TrimSuffix(strings.TrimPrefix(enumType, "enum("), ")")
	content = strings.ReplaceAll(content, " ", "")
	
	if content == "" {
		return nil
	}
	
	return strings.Split(content, ",")
}