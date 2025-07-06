package cmd

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/spf13/cobra"
	"packet_sender/internal/simulator"
	"packet_sender/internal/logger"
	"packet_sender/internal/utils"
)

// sendCmd represents the send command
var sendCmd = &cobra.Command{
	Use:   "send",
	Short: "Send custom packets",
	Long: `Send custom packets to test specific scenarios.

This command allows you to send individual packets with custom data
to test specific backend behavior or simulate particular conditions.

Examples:
  # Send a custom data packet
  packet-sender send data --board BCU --packet-id 123 --data '{"temperature": 25.5, "pressure": 1013.25}'

  # Send a protection fault
  packet-sender send protection --board LCU --severity fault --kind above --name "temperature" --value 85.0 --bound 80.0

  # Send a state transition
  packet-sender send state --board VCU --to-state RUNNING --reason "Manual activation"

  # Send an order acknowledgment
  packet-sender send order --board OBCCU --packet-id 456 --order-id 12345 --status completed`,
}

var sendDataCmd = &cobra.Command{
	Use:   "data",
	Short: "Send a custom data packet",
	Long:  "Send a data packet with custom variable values.",
	RunE:  sendDataPacket,
}

var sendProtectionCmd = &cobra.Command{
	Use:   "protection",
	Short: "Send a protection packet",
	Long:  "Send a protection packet (fault, warning, or ok).",
	RunE:  sendProtectionPacket,
}

var sendStateCmd = &cobra.Command{
	Use:   "state",
	Short: "Send a state transition packet",
	Long:  "Send a state machine transition packet.",
	RunE:  sendStatePacket,
}

var sendOrderCmd = &cobra.Command{
	Use:   "order",
	Short: "Send an order acknowledgment packet",
	Long:  "Send an order acknowledgment packet.",
	RunE:  sendOrderPacket,
}

var (
	sendBoard     string
	sendPacketID  int
	sendData      string
	sendSeverity  string
	sendKind      string
	sendName      string
	sendValue     float64
	sendBound     float64
	sendToState   string
	sendReason    string
	sendOrderID   int
	sendStatus    string
	dryRun        bool
)

func init() {
	rootCmd.AddCommand(sendCmd)
	sendCmd.AddCommand(sendDataCmd)
	sendCmd.AddCommand(sendProtectionCmd)
	sendCmd.AddCommand(sendStateCmd)
	sendCmd.AddCommand(sendOrderCmd)

	// Common flags
	sendCmd.PersistentFlags().StringVarP(&sendBoard, "board", "b", "", "board name (required)")
	sendCmd.PersistentFlags().BoolVar(&dryRun, "dry-run", false, "show what would be sent without actually sending")
	sendCmd.MarkPersistentFlagRequired("board")

	// Data packet flags
	sendDataCmd.Flags().IntVarP(&sendPacketID, "packet-id", "p", 0, "packet ID (required)")
	sendDataCmd.Flags().StringVarP(&sendData, "data", "d", "{}", "JSON data for variables")
	sendDataCmd.MarkFlagRequired("packet-id")

	// Protection packet flags
	sendProtectionCmd.Flags().StringVarP(&sendSeverity, "severity", "s", "fault", "severity (fault, warning, ok)")
	sendProtectionCmd.Flags().StringVarP(&sendKind, "kind", "k", "above", "kind (above, below, out_of_bounds, equals, not_equals)")
	sendProtectionCmd.Flags().StringVarP(&sendName, "name", "n", "", "protection name (required)")
	sendProtectionCmd.Flags().Float64VarP(&sendValue, "value", "v", 0, "current value")
	sendProtectionCmd.Flags().Float64VarP(&sendBound, "bound", "B", 0, "bound/threshold value")
	sendProtectionCmd.MarkFlagRequired("name")

	// State packet flags
	sendStateCmd.Flags().StringVarP(&sendToState, "to-state", "t", "", "target state (required)")
	sendStateCmd.Flags().StringVarP(&sendReason, "reason", "r", "Manual state transition", "transition reason")
	sendStateCmd.MarkFlagRequired("to-state")

	// Order packet flags
	sendOrderCmd.Flags().IntVarP(&sendPacketID, "packet-id", "p", 0, "packet ID (required)")
	sendOrderCmd.Flags().IntVarP(&sendOrderID, "order-id", "o", 0, "order ID (required)")
	sendOrderCmd.Flags().StringVarP(&sendStatus, "status", "s", "received", "order status (received, executing, completed, failed, timeout)")
	sendOrderCmd.MarkFlagRequired("packet-id")
	sendOrderCmd.MarkFlagRequired("order-id")
}

func sendDataPacket(cmd *cobra.Command, args []string) error {
	adj, err := utils.LoadADJ()
	if err != nil {
		return fmt.Errorf("failed to load ADJ: %w", err)
	}

	board, found := utils.GetBoardByName(adj, sendBoard)
	if !found {
		return fmt.Errorf("board '%s' not found", sendBoard)
	}

	// Parse JSON data
	var jsonData map[string]interface{}
	if err := json.Unmarshal([]byte(sendData), &jsonData); err != nil {
		return fmt.Errorf("invalid JSON data: %w", err)
	}

	// Add packet ID to data
	jsonData["packet_id"] = sendPacketID

	if dryRun {
		fmt.Printf("Would send data packet to board '%s':\n", sendBoard)
		fmt.Printf("  Packet ID: %d\n", sendPacketID)
		fmt.Printf("  Data: %s\n", sendData)
		return nil
	}

	// Create temporary simulator to send the packet
	config := createTempConfig()
	log := logger.NewLogger("info")
	sim := simulator.NewBoardSimulator(board, config, log)

	if err := sim.Start(); err != nil {
		return fmt.Errorf("failed to start simulator: %w", err)
	}
	defer sim.Stop()

	// Wait for connection
	if err := waitForConnection(sim); err != nil {
		return err
	}

	// Send the packet
	if err := sim.SendCustomPacket("data", jsonData); err != nil {
		return fmt.Errorf("failed to send data packet: %w", err)
	}

	fmt.Printf("Data packet sent successfully to board '%s'\n", sendBoard)
	return nil
}

func sendProtectionPacket(cmd *cobra.Command, args []string) error {
	adj, err := utils.LoadADJ()
	if err != nil {
		return fmt.Errorf("failed to load ADJ: %w", err)
	}

	board, found := utils.GetBoardByName(adj, sendBoard)
	if !found {
		return fmt.Errorf("board '%s' not found", sendBoard)
	}

	data := map[string]interface{}{
		"severity": sendSeverity,
		"kind":     sendKind,
		"name":     sendName,
		"value":    sendValue,
		"bound":    sendBound,
	}

	if dryRun {
		fmt.Printf("Would send protection packet to board '%s':\n", sendBoard)
		fmt.Printf("  Severity: %s\n", sendSeverity)
		fmt.Printf("  Kind: %s\n", sendKind)
		fmt.Printf("  Name: %s\n", sendName)
		fmt.Printf("  Value: %.2f\n", sendValue)
		fmt.Printf("  Bound: %.2f\n", sendBound)
		return nil
	}

	// Create temporary simulator to send the packet
	config := createTempConfig()
	log := logger.NewLogger("info")
	sim := simulator.NewBoardSimulator(board, config, log)

	if err := sim.Start(); err != nil {
		return fmt.Errorf("failed to start simulator: %w", err)
	}
	defer sim.Stop()

	// Wait for connection
	if err := waitForConnection(sim); err != nil {
		return err
	}

	// Send the packet
	if err := sim.SendCustomPacket("protection", data); err != nil {
		return fmt.Errorf("failed to send protection packet: %w", err)
	}

	fmt.Printf("Protection packet (%s %s) sent successfully to board '%s'\n", 
		sendSeverity, sendKind, sendBoard)
	return nil
}

func sendStatePacket(cmd *cobra.Command, args []string) error {
	adj, err := utils.LoadADJ()
	if err != nil {
		return fmt.Errorf("failed to load ADJ: %w", err)
	}

	board, found := utils.GetBoardByName(adj, sendBoard)
	if !found {
		return fmt.Errorf("board '%s' not found", sendBoard)
	}

	data := map[string]interface{}{
		"to_state": strings.ToUpper(sendToState),
		"reason":   sendReason,
	}

	if dryRun {
		fmt.Printf("Would send state transition packet to board '%s':\n", sendBoard)
		fmt.Printf("  To State: %s\n", strings.ToUpper(sendToState))
		fmt.Printf("  Reason: %s\n", sendReason)
		return nil
	}

	// Create temporary simulator to send the packet
	config := createTempConfig()
	log := logger.NewLogger("info")
	sim := simulator.NewBoardSimulator(board, config, log)

	if err := sim.Start(); err != nil {
		return fmt.Errorf("failed to start simulator: %w", err)
	}
	defer sim.Stop()

	// Wait for connection
	if err := waitForConnection(sim); err != nil {
		return err
	}

	// Send the packet
	if err := sim.SendCustomPacket("state", data); err != nil {
		return fmt.Errorf("failed to send state packet: %w", err)
	}

	fmt.Printf("State transition packet sent successfully to board '%s'\n", sendBoard)
	return nil
}

func sendOrderPacket(cmd *cobra.Command, args []string) error {
	adj, err := utils.LoadADJ()
	if err != nil {
		return fmt.Errorf("failed to load ADJ: %w", err)
	}

	board, found := utils.GetBoardByName(adj, sendBoard)
	if !found {
		return fmt.Errorf("board '%s' not found", sendBoard)
	}

	data := map[string]interface{}{
		"packet_id": float64(sendPacketID),
		"order_id":  float64(sendOrderID),
		"status":    sendStatus,
	}

	if dryRun {
		fmt.Printf("Would send order packet to board '%s':\n", sendBoard)
		fmt.Printf("  Packet ID: %d\n", sendPacketID)
		fmt.Printf("  Order ID: %d\n", sendOrderID)
		fmt.Printf("  Status: %s\n", sendStatus)
		return nil
	}

	// Create temporary simulator to send the packet
	config := createTempConfig()
	log := logger.NewLogger("info")
	sim := simulator.NewBoardSimulator(board, config, log)

	if err := sim.Start(); err != nil {
		return fmt.Errorf("failed to start simulator: %w", err)
	}
	defer sim.Stop()

	// Wait for connection
	if err := waitForConnection(sim); err != nil {
		return err
	}

	// Send the packet
	if err := sim.SendCustomPacket("order", data); err != nil {
		return fmt.Errorf("failed to send order packet: %w", err)
	}

	fmt.Printf("Order packet sent successfully to board '%s'\n", sendBoard)
	return nil
}

func createTempConfig() *simulator.Config {
	return &simulator.Config{
		BackendAddress:     backendAddress,
		BackendPort:        backendPort,
		BackendTCPPort:     backendTCPPort,
		AutoReconnect:      true,
		ReconnectInterval:  reconnectInterval,
		MaxRetries:         maxRetries,
		PacketInterval:     packetInterval,
		EnableProtections:  true,
		EnableStateChanges: true,
		EnableOrderAcks:    true,
		LogLevel:           "warn", // Reduce noise for single packet sends
	}
}

func waitForConnection(sim *simulator.BoardSimulator) error {
	fmt.Printf("Connecting to backend at %s:%d...", backendAddress, backendPort)
	
	// Wait up to 10 seconds for connection
	for i := 0; i < 100; i++ {
		if sim.IsConnected() {
			fmt.Println(" connected!")
			return nil
		}
		fmt.Print(".")
		time.Sleep(100 * time.Millisecond)
	}
	
	fmt.Println(" failed!")
	return fmt.Errorf("failed to connect to backend")
}