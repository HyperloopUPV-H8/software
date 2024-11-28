package adj

import (
	"encoding/json"
	"github.com/go-git/go-git/v5"
	"os"
)

const (
	RepoUrl = "https://github.com/HyperloopUPV-H8/JSON_ADE.git" // URL of the ADJ repository
)

func downloadADJ() (json.RawMessage, json.RawMessage, error) {
	_, err := git.PlainClone("", false, &git.CloneOptions{
		URL: RepoUrl,
	})
	if err != nil {
		return nil, nil, err
	}

	info, err := os.ReadFile("general_info.json")
	if err != nil {
		return nil, nil, err
	}

	boards, err := os.ReadFile("boards.json")
	if err != nil {
		return nil, nil, err
	}

	return info, boards, nil
}

func NewADJ() (*ADJ, error) {
	infoRaw, boardsRaw, err := downloadADJ()
	if err != nil {
		return nil, err
	}

	var info Info
	if err := json.Unmarshal(infoRaw, &info); err != nil {
		return nil, err
	}

	var boards map[string]Board
	if err := json.Unmarshal(boardsRaw, &boards); err != nil {
		return nil, err
	}

	adj := &ADJ{
		Info:   info,
		Boards: boards,
	}

	return adj, nil
}
