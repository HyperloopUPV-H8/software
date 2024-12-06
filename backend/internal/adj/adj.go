package adj

import (
	"encoding/json"
	"github.com/HyperloopUPV-H8/h9-backend/internal/utils"
	"github.com/go-git/go-git/v5"
	"os"
)

const (
	RepoUrl  = "https://github.com/HyperloopUPV-H8/JSON_ADE.git" // URL of the ADJ repository
	RepoPath = "./JSON_ADE/"                                     // Path where the ADJ repository is cloned
)

func NewADJ() (*ADJ, error) {
	infoRaw, boardsRaw, err := downloadADJ()
	if err != nil {
		return nil, err
	}

	var infoJSON InfoJSON
	if err := json.Unmarshal(infoRaw, &infoJSON); err != nil {
		return nil, err
	}

	var info Info
	for key, value := range infoJSON.Units {
		info.Units[key], err = utils.NewOperations(value)
		if err != nil {
			return nil, err
		}
	}

	var boardsList map[string]string
	if err := json.Unmarshal(boardsRaw, &boardsList); err != nil {
		return nil, err
	}

	boards, err := getBoards(boardsList)

	info.BoardIds, err = getBoardIds(boardsList)

	info.Addresses, err = getAddresses(boards)

	adj := &ADJ{
		Info:   info,
		Boards: boards,
	}

	return adj, nil
}

func downloadADJ() (json.RawMessage, json.RawMessage, error) {
	if !checkRepo() {
		_, err := git.PlainClone(RepoPath, false, &git.CloneOptions{
			URL: RepoUrl,
		})
		if err != nil {
			return nil, nil, err
		}
	}

	// The BoardIds are applied in the NewADJ function by the getBoardIds function
	info, err := os.ReadFile(RepoPath + "general_info.json")
	if err != nil {
		return nil, nil, err
	}

	boardsList, err := os.ReadFile(RepoPath + "boards.json")
	if err != nil {
		return nil, nil, err
	}

	return info, boardsList, nil
}

func checkRepo() bool {
	if _, err := os.Stat(RepoPath); os.IsNotExist(err) {
		return false
	}

	return true
}

func getBoards(boardsList map[string]string) (map[string]Board, error) {
	var boards map[string]Board
	for boardName, boardPath := range boardsList {
		if _, err := os.Stat(boardPath); os.IsNotExist(err) {
			return nil, err
		}

		boardRaw, err := os.ReadFile(boardPath)
		if err != nil {
			return nil, err
		}

		var boardJSON BoardJSON
		if err = json.Unmarshal(boardRaw, &boardJSON); err != nil {
			return nil, err
		}

		var board Board
		board.Name = boardName
		board.IP = boardJSON.IP

		board.Packets, err = getBoardPackets(boardJSON.PacketsPaths)
		if err != nil {
			return nil, err
		}

		board.Measurements, err = getBoardMeasurements(boardJSON.MeasurementsPaths)
		if err != nil {
			return nil, err
		}

		board.Structures = getBoardStructures(board)

		boards[boardName] = board
	}

	return boards, nil
}

func getBoardPackets(packetsPaths []string) ([]Packet, error) {
	var packets []Packet
	for _, packetPath := range packetsPaths {
		if _, err := os.Stat(packetPath); os.IsNotExist(err) {
			continue
		}

		packetRaw, err := os.ReadFile(packetPath)
		if err != nil {
			return nil, err
		}

		var packet Packet
		if err = json.Unmarshal(packetRaw, &packet); err != nil {
			return nil, err
		}

		packets = append(packets, packet)
	}

	return packets, nil
}

func getBoardMeasurements(measurementsPaths []string) ([]Measurement, error) {
	var measurements []Measurement
	for _, measurementPath := range measurementsPaths {
		if _, err := os.Stat(measurementPath); os.IsNotExist(err) {
			continue
		}

		measurementRaw, err := os.ReadFile(measurementPath)
		if err != nil {
			return nil, err
		}

		var measurement Measurement
		if err = json.Unmarshal(measurementRaw, &measurement); err != nil {
			return nil, err
		}

		measurements = append(measurements, measurement)
	}

	return measurements, nil
}

func getBoardIds(boards map[string]string) (map[string]uint16, error) {
	var boardIds map[string]uint16
	for boardName, boardPath := range boards {
		if _, err := os.Stat(boardPath); os.IsNotExist(err) {
			return nil, err
		}

		boardRaw, err := os.ReadFile(boardPath)
		if err != nil {
			return nil, err
		}

		var boardJSON BoardJSON
		if err = json.Unmarshal(boardRaw, &boardJSON); err != nil {
			return nil, err
		}

		boardIds[boardName] = boardJSON.ID
	}

	return boardIds, nil
}

func getBoardStructures(board Board) []Structure {
	var structures []Structure
	for _, packet := range board.Packets {
		var structure Structure
		structure.Packet = packet
		structure.Measurements = board.Measurements
	}

	return structures
}

func getAddresses(boards map[string]Board) (map[string]string, error) {
	var addresses map[string]string
	for boardName, board := range boards {
		addresses[boardName] = board.IP
	}

	return addresses, nil
}
