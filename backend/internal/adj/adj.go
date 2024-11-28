package adj

import (
	"encoding/json"
	"github.com/go-git/go-git/v5"
	"os"
)

const (
	RepoUrl = "https://github.com/HyperloopUPV-H8/JSON_ADE.git" // URL of the ADJ repository
)

func NewADJ() (*ADJ, error) {
	infoRaw, boardsRaw, err := downloadADJ()
	if err != nil {
		return nil, err
	}

	var info Info
	if err := json.Unmarshal(infoRaw, &info); err != nil {
		return nil, err
	}

	var boardsList map[string]string
	if err := json.Unmarshal(boardsRaw, &boardsList); err != nil {
		return nil, err
	}

	boards, err := getBoards(boardsList)

	info.BoardIds, err = getBoardIds(boardsList)

	adj := &ADJ{
		Info:   info,
		Boards: boards,
	}

	return adj, nil
}

func downloadADJ() (json.RawMessage, json.RawMessage, error) {
	_, err := git.PlainClone("", false, &git.CloneOptions{
		URL: RepoUrl,
	})
	if err != nil {
		return nil, nil, err
	}

	// The BoardIds are applied in the NewADJ function by the getBoardIds function
	info, err := os.ReadFile("general_info.json")
	if err != nil {
		return nil, nil, err
	}

	boardsList, err := os.ReadFile("boards.json")
	if err != nil {
		return nil, nil, err
	}

	return info, boardsList, nil
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

		go checkBoardIP(boardJSON.IP) // TODO: Implement this function

		var board Board

		board.Name = boardName
		board.Packets = getBoardPackets(boardJSON.PacketsPaths)
		board.Measurements = getBoardMeasurements(boardJSON.MeasurementsPaths)
		// board.Structures = getBoardStructures( boardJSON.StructuresPaths) // TODO: Issued in JSON_ADE #1

		boards[boardName] = board
	}

	return boards, nil
}

func getBoardIds(boards map[string]string) (map[string]string, error) {
	var boardIds map[string]string
}
