package adj

import (
	"encoding/json"
	"os"
	"path"

	"github.com/HyperloopUPV-H8/h9-backend/internal/utils"
	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
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

	type BoardList struct {
		Boards map[string]string `json:"boards"`
	}

	var boardsList BoardList
	if err := json.Unmarshal(boardsRaw, &boardsList); err != nil {
		return ADJ{}, err
	}

	boards, err := getBoards(boardsList.Boards)
	if err != nil {
		return ADJ{}, err
	}

	info.BoardIds, err = getBoardIds(boardsList.Boards)
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

// WARNING: Doing tricks on it
func updateRepo(AdjBranch string) error {
	var repo *git.Repository
	var err error

	if AdjBranch == "" {
		// Makes use of submodule
		return nil
	} else {
		if _, err = os.Stat(RepoPath); os.IsNotExist(err) {
			repo, err = git.PlainClone(RepoPath, false, &git.CloneOptions{
				URL:           RepoUrl,
				ReferenceName: plumbing.NewBranchReferenceName(AdjBranch),
				SingleBranch:  true,
				Depth:         1,
			})
			if err != nil {
				return err
			}
		} else {
			repo, err = git.PlainOpen(RepoPath)
			if err != nil {
				return err
			}
		}

		err = repo.Fetch(&git.FetchOptions{
			RemoteName: "origin",
			Force:      true,
		})
		if err != nil && err != git.NoErrAlreadyUpToDate {
			return err
		}

		head, err := repo.Head()
		if err != nil {
			return err
		}

		branch := head.Name().Short()

		println("actual branch is: ", branch)

		worktree, err := repo.Worktree()
		if err != nil {
			return err
		}

		println(head.Name().Short(), AdjBranch)

		if branch != AdjBranch {
			localBranchRef := plumbing.NewBranchReferenceName(AdjBranch)
			_, err = repo.Reference(localBranchRef, false)
			if err != nil {
				remoteBranchRef := plumbing.NewRemoteReferenceName("origin", AdjBranch)
				remoteRef, err2 := repo.Reference(remoteBranchRef, true)
				if err2 != nil {
					return err2
				}

				err = worktree.Checkout(&git.CheckoutOptions{
					Branch: localBranchRef,
					Create: true,
					Force:  true,
					Hash: remoteRef.Hash(),
				})
				if err != nil {
					println(err.Error())
					return err
				}
			} else {
				err = worktree.Checkout(&git.CheckoutOptions{
					Branch: localBranchRef,
					Force: true,
				})
			}
		}

		err = worktree.Pull(&git.PullOptions{
			RemoteName:   "origin",
			SingleBranch: true,
		})
		if err != nil {
			if err == git.NoErrAlreadyUpToDate {
				return nil
			} else {
				return err
			}
		}
	}

	return nil
}

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
	measurements := make([]Measurement, 0)

	for _, measurementPath := range measurementsPaths {
		if _, err := os.Stat(measurementPath); os.IsNotExist(err) {
			continue
		}

		measurementRaw, err := os.ReadFile(measurementPath)
		if err != nil {
			return nil, err
		}

		// Absolutely doing tricks on it AGAIN - @msanlli
		type MeasurementJSON struct {
			Measurements []Measurement `json:"measurements"`
		}

		measurementsJSON := MeasurementJSON{}
		if err = json.Unmarshal(measurementRaw, &measurementsJSON); err != nil {
			return nil, err
		}
		for _, measurementTMP := range measurementsJSON.Measurements {
			measurements = append(measurements, measurementTMP)
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
