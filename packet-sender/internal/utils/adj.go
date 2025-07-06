package utils

import (
	"fmt"
	"os"
	"path"

	adj_module "github.com/HyperloopUPV-H8/h9-backend/pkg/adj"
)

func LoadADJ() (adj_module.ADJ, error) {
	// Remove existing ADJ directory if it exists
	if err := os.RemoveAll("adj"); err != nil {
		return adj_module.ADJ{}, fmt.Errorf("failed to remove existing ADJ: %w", err)
	}
	
	// Copy ADJ from backend directory
	srcPath := path.Join("..", "backend", "cmd", "adj")
	if err := CopyDir(srcPath, "adj"); err != nil {
		return adj_module.ADJ{}, fmt.Errorf("failed to copy ADJ: %w", err)
	}
	
	// Load ADJ configuration
	adj, err := adj_module.NewADJ("", false)
	if err != nil {
		return adj_module.ADJ{}, fmt.Errorf("failed to load ADJ: %w", err)
	}
	
	return adj, nil
}

func ValidateADJ() error {
	adj, err := LoadADJ()
	if err != nil {
		return err
	}
	
	// Basic validation
	if len(adj.Boards) == 0 {
		return fmt.Errorf("no boards found in ADJ configuration")
	}
	
	for _, board := range adj.Boards {
		if board.Name == "" {
			return fmt.Errorf("board has empty name")
		}
		if board.IP == "" {
			return fmt.Errorf("board %s has empty IP", board.Name)
		}
		if len(board.Packets) == 0 {
			return fmt.Errorf("board %s has no packets", board.Name)
		}
	}
	
	return nil
}

func GetBoardNames(adj adj_module.ADJ) []string {
	names := make([]string, 0, len(adj.Boards))
	for _, board := range adj.Boards {
		names = append(names, board.Name)
	}
	return names
}

func GetBoardByName(adj adj_module.ADJ, name string) (adj_module.Board, bool) {
	for _, board := range adj.Boards {
		if board.Name == name {
			return board, true
		}
	}
	return adj_module.Board{}, false
}

func GetDataPackets(board adj_module.Board) []adj_module.Packet {
	var dataPackets []adj_module.Packet
	for _, packet := range board.Packets {
		if packet.Type == "data" {
			dataPackets = append(dataPackets, packet)
		}
	}
	return dataPackets
}

func GetOrderPackets(board adj_module.Board) []adj_module.Packet {
	var orderPackets []adj_module.Packet
	for _, packet := range board.Packets {
		if packet.Type == "order" {
			orderPackets = append(orderPackets, packet)
		}
	}
	return orderPackets
}

func GetPacketByID(board adj_module.Board, packetID uint16) (adj_module.Packet, bool) {
	for _, packet := range board.Packets {
		if packet.Id == packetID {
			return packet, true
		}
	}
	return adj_module.Packet{}, false
}