package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
	"packet_sender/internal/utils"
)

// listCmd represents the list command
var listCmd = &cobra.Command{
	Use:   "list",
	Short: "List available boards and packets",
	Long: `List all available boards and their packets from the ADJ configuration.

Examples:
  # List all boards
  packet-sender list boards

  # List packets for a specific board
  packet-sender list packets --board BCU

  # List data packets only
  packet-sender list packets --board BCU --type data

  # List all packet types
  packet-sender list types`,
}

var listBoardsCmd = &cobra.Command{
	Use:   "boards",
	Short: "List all available boards",
	Long:  "List all boards configured in the ADJ with their basic information.",
	RunE:  listBoards,
}

var listPacketsCmd = &cobra.Command{
	Use:   "packets",
	Short: "List packets for a board",
	Long:  "List all packets available for a specific board.",
	RunE:  listPackets,
}

var listTypesCmd = &cobra.Command{
	Use:   "types",
	Short: "List all packet types",
	Long:  "List all available packet types in the system.",
	RunE:  listTypes,
}

var (
	targetBoard  string
	packetType   string
	showDetails  bool
)

func init() {
	rootCmd.AddCommand(listCmd)
	listCmd.AddCommand(listBoardsCmd)
	listCmd.AddCommand(listPacketsCmd)
	listCmd.AddCommand(listTypesCmd)

	// Flags for list packets command
	listPacketsCmd.Flags().StringVarP(&targetBoard, "board", "b", "", "board name (required)")
	listPacketsCmd.Flags().StringVarP(&packetType, "type", "t", "", "packet type filter (data, order, protection, state)")
	listPacketsCmd.Flags().BoolVarP(&showDetails, "details", "d", false, "show detailed packet information")
	listPacketsCmd.MarkFlagRequired("board")

	// Flags for list boards command
	listBoardsCmd.Flags().BoolVarP(&showDetails, "details", "d", false, "show detailed board information")
}

func listBoards(cmd *cobra.Command, args []string) error {
	adj, err := utils.LoadADJ()
	if err != nil {
		return fmt.Errorf("failed to load ADJ: %w", err)
	}

	fmt.Printf("Available Boards (%d):\n\n", len(adj.Boards))
	
	i := 1
	for _, board := range adj.Boards {
		fmt.Printf("%d. %s\n", i, board.Name)
		i++
		if showDetails {
			fmt.Printf("   IP: %s\n", board.IP)
			
			// Count packets by type
			dataCount := 0
			orderCount := 0
			protectionCount := 0
			stateCount := 0
			otherCount := 0
			
			for _, packet := range board.Packets {
				switch packet.Type {
				case "data":
					dataCount++
				case "order":
					orderCount++
				case "protection":
					protectionCount++
				case "state":
					stateCount++
				default:
					otherCount++
				}
			}
			
			fmt.Printf("   Packets: %d total", len(board.Packets))
			if dataCount > 0 {
				fmt.Printf(" (%d data", dataCount)
			}
			if orderCount > 0 {
				fmt.Printf(", %d order", orderCount)
			}
			if protectionCount > 0 {
				fmt.Printf(", %d protection", protectionCount)
			}
			if stateCount > 0 {
				fmt.Printf(", %d state", stateCount)
			}
			if otherCount > 0 {
				fmt.Printf(", %d other", otherCount)
			}
			fmt.Println(")")
			fmt.Println()
		}
	}
	
	if !showDetails {
		fmt.Println("\nUse --details flag to see more information about each board.")
	}

	return nil
}

func listPackets(cmd *cobra.Command, args []string) error {
	adj, err := utils.LoadADJ()
	if err != nil {
		return fmt.Errorf("failed to load ADJ: %w", err)
	}

	board, found := utils.GetBoardByName(adj, targetBoard)
	if !found {
		return fmt.Errorf("board '%s' not found", targetBoard)
	}

	// Filter packets by type if specified
	var packets []string
	for _, packet := range board.Packets {
		if packetType == "" || packet.Type == packetType {
			if showDetails {
				packets = append(packets, fmt.Sprintf("ID %d: %s (%s) - %d variables", 
					packet.Id, packet.Name, packet.Type, len(packet.Variables)))
			} else {
				packets = append(packets, fmt.Sprintf("ID %d: %s (%s)", 
					packet.Id, packet.Name, packet.Type))
			}
		}
	}

	if len(packets) == 0 {
		fmt.Printf("No packets found for board '%s'", targetBoard)
		if packetType != "" {
			fmt.Printf(" with type '%s'", packetType)
		}
		fmt.Println()
		return nil
	}

	fmt.Printf("Packets for board '%s'", targetBoard)
	if packetType != "" {
		fmt.Printf(" (type: %s)", packetType)
	}
	fmt.Printf(" (%d found):\n\n", len(packets))

	for i, packet := range packets {
		fmt.Printf("%d. %s\n", i+1, packet)
	}

	if showDetails {
		fmt.Println("\nVariable details:")
		for _, packet := range board.Packets {
			if packetType == "" || packet.Type == packetType {
				fmt.Printf("\n%s (ID %d):\n", packet.Name, packet.Id)
				for j, variable := range packet.Variables {
					rangeInfo := ""
					if len(variable.SafeRange) == 2 && variable.SafeRange[0] != nil && variable.SafeRange[1] != nil {
						rangeInfo = fmt.Sprintf(" [safe: %.2f-%.2f]", *variable.SafeRange[0], *variable.SafeRange[1])
					} else if len(variable.WarningRange) == 2 && variable.WarningRange[0] != nil && variable.WarningRange[1] != nil {
						rangeInfo = fmt.Sprintf(" [warn: %.2f-%.2f]", *variable.WarningRange[0], *variable.WarningRange[1])
					}
					fmt.Printf("  %d. %s (%s)%s\n", j+1, variable.Name, variable.Type, rangeInfo)
				}
			}
		}
	}

	return nil
}

func listTypes(cmd *cobra.Command, args []string) error {
	adj, err := utils.LoadADJ()
	if err != nil {
		return fmt.Errorf("failed to load ADJ: %w", err)
	}

	typeCount := make(map[string]int)
	for _, board := range adj.Boards {
		for _, packet := range board.Packets {
			typeCount[packet.Type]++
		}
	}

	fmt.Println("Available Packet Types:\n")
	
	for packetType, count := range typeCount {
		description := getTypeDescription(packetType)
		fmt.Printf("• %s (%d packets) - %s\n", packetType, count, description)
	}

	fmt.Println("\nSupported packet types for simulation:")
	fmt.Println("• data - Telemetry measurements (always enabled)")
	fmt.Println("• protection - Fault/warning notifications (--enable-protections)")
	fmt.Println("• state - State machine transitions (--enable-states)")
	fmt.Println("• order - Command acknowledgments (--enable-orders)")

	return nil
}

func getTypeDescription(packetType string) string {
	descriptions := map[string]string{
		"data":       "Telemetry and measurement data",
		"order":      "Commands and control instructions",
		"protection": "Safety alerts and protection notifications",
		"state":      "State machine and status information",
		"blcu":       "Bootloader communication",
	}
	
	if desc, exists := descriptions[packetType]; exists {
		return desc
	}
	return "Custom packet type"
}