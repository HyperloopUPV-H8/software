package adj

import (
	"os"

	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
)

// WARNING: Doing tricks on it
func updateRepo(AdjBranch string) error {
	var err error

	if AdjBranch == "" {
		// Makes use of user's custom ADJ
		return nil
	} else {
		cloneOptions := &git.CloneOptions{
			URL:           RepoUrl,
			ReferenceName: plumbing.NewBranchReferenceName(AdjBranch),
			SingleBranch:  true,
			Depth:         1,
		}
		if _, err = os.Stat(RepoPath); os.IsNotExist(err) {
			_, err = git.PlainClone(RepoPath, false, cloneOptions)
			if err != nil {
				return err
			}
		} else {
			if err = os.RemoveAll(RepoPath); err != nil {
				return err
			}
			_, err = git.PlainClone(RepoPath, false, cloneOptions)
			if err != nil {
				return err
			}
		}
	}

	return nil
}
