package adj

import (
	"encoding/json"
	"log"
	"os"
	"os/exec"

	"github.com/HyperloopUPV-H8/h9-backend/internal/utils"
)

const (
	RepoUrl  = "https://github.com/HyperloopUPV-H8/adj.git" // URL of the ADJ repository
	RepoPath = "./adj/"                                     // Path where the ADJ repository is cloned
)

func NewADJ(AdjBranch string) (ADJ, error) {
	infoRaw, boardsRaw, err := downloadADJ(AdjBranch)
	if err != nil {
		return ADJ{}, err
	}

	var infoJSON InfoJSON
	if err := json.Unmarshal(infoRaw, &infoJSON); err != nil {
		println("Info JSON unmarshal error")
		return ADJ{}, err
	}

	var info Info = Info{
		Ports:      infoJSON.Ports,
		MessageIds: infoJSON.MessageIds,
		Units:      make(map[string]utils.Operations),
	}
	for key, value := range infoJSON.Units {
		info.Units[key], err = utils.NewOperations(value)
		if err != nil {
			return ADJ{}, err
		}
	}

	var boardsList map[string]string
	if err := json.Unmarshal(boardsRaw, &boardsList); err != nil {
		return ADJ{}, err
	}

	boards, err := getBoards(boardsList)
	if err != nil {
		return ADJ{}, err
	}

	info.BoardIds, err = getBoardIds(boardsList)
	if err != nil {
		return ADJ{}, err
	}

	info.Addresses, err = getAddresses(boards)
	if err != nil {
		return ADJ{}, err
	}
	for target, address := range infoJSON.Addresses {
		info.Addresses[target] = address
	}

	adj := ADJ{
		Info:   info,
		Boards: boards,
	}

	return adj, nil
}

func downloadADJ(AdjBranch string) (json.RawMessage, json.RawMessage, error) {
	updateRepo(AdjBranch)

	// The BoardIds are applied in the NewADJ function by the getBoardIds function
	//Execute the script testadj.py (fix bug)
	test := exec.Command("python3", "testadj.py")
	out, err := test.CombinedOutput()
	if err != nil || len(out) != 0 {
		log.Fatalf("python test failed:\nError: %v\nOutput: %s\n", err, string(out))
	}

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
