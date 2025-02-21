package adj

import (
	"encoding/json"
	"os"
	"path"
)

func getBoards(boardsList map[string]string) (map[string]Board, error) {
	boards := make(map[string]Board, len(boardsList))
	for boardName, boardPath := range boardsList {
		fullPath := path.Join(RepoPath, boardPath)
		boardRaw, err := os.ReadFile(fullPath)
		if err != nil {
			return nil, err
		}

		var boardJSON BoardJSON
		if err = json.Unmarshal(boardRaw, &boardJSON); err != nil {
			return nil, err
		}

		measPathsFr := make([]string, 0)
		for _, measPath := range boardJSON.MeasurementsPaths {
			measPathsFr = append(measPathsFr, path.Join(RepoPath, "boards", boardName, measPath))
		}
		boardJSON.MeasurementsPaths = measPathsFr

		packetPathsFr := make([]string, 0)
		for _, packetPath := range boardJSON.PacketsPaths {
			packetPathsFr = append(packetPathsFr, path.Join(RepoPath, "boards", boardName, packetPath))
		}
		boardJSON.PacketsPaths = packetPathsFr

		board := Board{
			Name: boardName,
			IP:   boardJSON.IP,
		}
		board.Packets, err = getBoardPackets(boardJSON.PacketsPaths)
		if err != nil {
			return nil, err
		}

		board.Measurements, err = getBoardMeasurements(boardJSON.MeasurementsPaths)
		if err != nil {
			return nil, err
		}
		board.LookUpMeasurements = make(map[string]Measurement, len(board.Measurements))

		for _, measurement := range board.Measurements {
			board.LookUpMeasurements[measurement.Id] = measurement
		}
		board.Structures = getBoardStructures(board)

		boards[boardName] = board
	}

	return boards, nil
}

func getBoardPackets(packetsPaths []string) ([]Packet, error) {
	packets := make([]Packet, 0)
	for _, packetPath := range packetsPaths {
		if _, err := os.Stat(packetPath); os.IsNotExist(err) {
			continue
		}

		packetRaw, err := os.ReadFile(packetPath)
		if err != nil {
			return nil, err
		}

		// Magic happens here
		type PacketJSON struct {
			Packet []Packet `json:"packets"`
		}

		packetsJSON := PacketJSON{}
		if err = json.Unmarshal(packetRaw, &packetsJSON); err != nil {
			return nil, err
		}
		for _, packetTMP := range packetsJSON.Packet {
			packets = append(packets, packetTMP)
		}
	}

	return packets, nil
}

func getBoardMeasurements(measurementsPaths []string) ([]Measurement, error) {
	measurementsTMP := make([]MeasurementJSON, 0)

	for _, measurementPath := range measurementsPaths {
		if _, err := os.Stat(measurementPath); os.IsNotExist(err) {
			continue
		}

		measurementRaw, err := os.ReadFile(measurementPath)
		if err != nil {
			return nil, err
		}

		// Absolutely doing tricks on it AGAIN - @msanlli
		type MeasurementsJSON struct {
			Measurements []MeasurementJSON `json:"measurements"`
		}

		measurementsJSON := MeasurementsJSON{}
		if err = json.Unmarshal(measurementRaw, &measurementsJSON); err != nil {
			return nil, err
		}
		for _, measurementTMP := range measurementsJSON.Measurements {
			measurementsTMP = append(measurementsTMP, measurementTMP)
		}
	}

	measurements, err := getRanges(measurementsTMP)
	if err != nil {
		return nil, err
	}

	return measurements, nil
}

func getRanges(measurementsTMP []MeasurementJSON) ([]Measurement, error) {
	return nil, nil
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
