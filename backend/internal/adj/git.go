package adj

import (
	"os"

	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
)

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

		worktree, err := repo.Worktree()
		if err != nil {
			return err
		}

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
					Hash:   remoteRef.Hash(),
				})
				if err != nil {
					println(err.Error())
					return err
				}
			} else {
				err = worktree.Checkout(&git.CheckoutOptions{
					Branch: localBranchRef,
					Force:  true,
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
