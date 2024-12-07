package adj

import (
	"encoding/json"
	"os"
	"path"

	"github.com/HyperloopUPV-H8/h9-backend/internal/utils"
	"github.com/go-git/go-git/v5"
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
		println("Info JSON unmarshal error")
		return nil, err
	}

	var info Info = Info{
		Ports:      infoJSON.Ports,
		MessageIds: infoJSON.MessageIds,
		Units:      make(map[string]utils.Operations),
	}
	for key, value := range infoJSON.Units {
		info.Units[key], err = utils.NewOperations(value)
		if err != nil {
			return nil, err
		}
	}

	type BoardList struct {
		Boards map[string]string `json:"boards"`
	}

	var boardsList BoardList
	if err := json.Unmarshal(boardsRaw, &boardsList); err != nil {
		return nil, err
	}

	// TESTING
	for key, value := range boardsList.Boards {
		println("Boards: ", key, value)
	}

	boards, err := getBoards(boardsList.Boards)
	if err != nil {
		return nil, err
	}

	info.BoardIds, err = getBoardIds(boardsList.Boards)
	if err != nil {
		return nil, err
	}

	info.Addresses, err = getAddresses(boards)
	if err != nil {
		return nil, err
	}
	for target, address := range infoJSON.Addresses {
		info.Addresses[target] = address
	}

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
	boards := make(map[string]Board, len(boardsList))
	for boardName, boardPath := range boardsList {
		fullPath := path.Join(RepoPath, boardPath)
		println("Full path: ", fullPath) // TESTING
		boardRaw, err := os.ReadFile(fullPath)
		if err != nil {
			return nil, err
		}

		var boardJSON BoardJSON
		if err = json.Unmarshal(boardRaw, &boardJSON); err != nil {
			return nil, err
		}

		// Absolutely doing tricks on it - @msanlli
		packetPathsFr := make([]string, 0)
		for _, packetPath := range boardJSON.PacketsPaths {
			println(path.Join(RepoPath, "boards", boardName, packetPath))
			packetPathsFr = append(packetPathsFr, path.Join(RepoPath, "boards", boardName, packetPath))
		}
		boardJSON.PacketsPaths = packetPathsFr

		board := Board{
			Name: boardName,
			IP:   boardJSON.IP,
		}

		// TESTING
		println("Board name: ", boardName)
		println("Board IP: ", board.IP)

		board.Packets, err = getBoardPackets(boardJSON.PacketsPaths)
		if err != nil {
			return nil, err
		}

		// TESTING
		for _, packet := range board.Packets {
			println("Packet ID: ", packet.Id)
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
	packets := make([]Packet, 0)
	for _, packetPath := range packetsPaths {
		println(packetPath)
		if _, err := os.Stat(packetPath); os.IsNotExist(err) {
			println("I suck at coding") // TESTING
			continue
		}

		packetRaw, err := os.ReadFile(packetPath)
		if err != nil {
			return nil, err
		}

		// Magic happens here
		var packet Packet
		type PacketJSON struct {
			Packet []Packet `json:"packets"`
		}

		packetsJSON := PacketJSON{}
		if err = json.Unmarshal(packetRaw, &packetsJSON); err != nil {
			return nil, err
		}
		for _, packetTMP := range packetsJSON.Packet {
			packet = packetTMP

			println("Packet Name: ", packet.Name) // TESTING
			packets = append(packets, packet)
		}
	}

	return packets, nil
}

func getBoardMeasurements(measurementsPaths []string) ([]Measurement, error) {
	measurements := make([]Measurement, len(measurementsPaths))

	for _, measurementPath := range measurementsPaths {
		if _, err := os.Stat(measurementPath); os.IsNotExist(err) {
			continue
		}

		measurementRaw, err := os.ReadFile(measurementPath)
		if err != nil {
			return nil, err
		}

		// Absolutely doing tricks on it AGAIN - @msanlli
		var measurement Measurement
		type MeasurementJSON struct {
			Measurements []Measurement `json:"measurements"`
		}

		measurementsJSON := MeasurementJSON{}
		if err = json.Unmarshal(measurementRaw, &measurementsJSON); err != nil {
			return nil, err
		}
		for _, measurementTMP := range measurementsJSON.Measurements {
			measurement = measurementTMP

			println("Packet Name: ", measurementTMP.Name) // TESTING
			measurements = append(measurements, measurement)
		}
	}

	return measurements, nil
}

func getBoardIds(boards map[string]string) (map[string]uint16, error) {
	boardIds := make(map[string]uint16, len(boards))
	for boardName, boardPath := range boards {
		fullPath := path.Join(RepoPath, boardPath)
		boardRaw, err := os.ReadFile(fullPath)
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
	structures := make([]Structure, len(board.Packets))
	for i, packet := range board.Packets {
		structures[i] = Structure{
			Packet:       packet,
			Measurements: board.Measurements,
		}
	}

	return structures
}

func getAddresses(boards map[string]Board) (map[string]string, error) {
	addresses := make(map[string]string, len(boards))
	for boardName, board := range boards {
		addresses[boardName] = board.IP
	}

	return addresses, nil
}
