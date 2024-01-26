package blcu

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type BLCU struct {
	boardToId map[string]abstraction.BoardId
}

func NewBLCU(boarMap map[string]abstraction.BoardId) *BLCU {
	return &BLCU{
		boardToId: boarMap,
	}
}
