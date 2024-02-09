package boards

import "github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"

type Boards struct {
	BoardId  string
	BoardAPI abstraction.BoardAPI
}

func New(boardId string) *Boards {
	return &Boards{
		BoardId: boardId,
	}
}
func (boards *Boards) Id() string {
	return boards.BoardId
}

func (boards *Boards) Notify(abstraction.BoardNotification) {
	panic("TODO!")
}

func (boards *Boards) SetAPI(api abstraction.BoardAPI) {
	boards.BoardAPI = api
}
