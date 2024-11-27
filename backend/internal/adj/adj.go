package adj

import (
	"github.com/go-git/go-git/v5"
)

const (
	RepoUrl = "https://github.com/HyperloopUPV-H8/JSON_ADE.git" // URL of the ADJ repository
)

func downloadADJ() error {
	_, err := git.PlainClone("", false, &git.CloneOptions{
		URL: RepoUrl,
	})
	if err != nil {
		return err
	}

	return nil
}

func NewADJ() (*ADJ, error) {
	err := downloadADJ()
	if err != nil {
		return nil, err
	}

	return &ADJ{}, nil
}
