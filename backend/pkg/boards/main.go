package boards

import (
	"bytes"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/tftp"
	"time"
)

type Boards struct {
	BoardId  string
	BoardAPI abstraction.BoardAPI
	Result   []byte
}

func New(boardId string) *Boards {
	return &Boards{
		BoardId: boardId,
	}
}
func (boards *Boards) Id() string {
	return boards.BoardId
}

func (boards *Boards) Notify(notification abstraction.BoardNotification) {
	switch notification.Event() {
	case "ack":

	case "download":
		client, ok := tftp.NewClient("192.168.0.9:69")
		if ok != nil {
			ErrNewClientFailed{
				Addr:      "192.168.0.9:69",
				Timestamp: time.Now(),
				Inner:     ok,
			}.Error()
		}

		buffer := &bytes.Buffer{}

		_, ok = client.ReadFile(string(notification.Event()), tftp.BinaryMode, buffer)

	case "upload":
		client, ok := tftp.NewClient("192.168.0.9:69")
		if ok != nil {
			ErrNewClientFailed{
				Addr:      "192.168.0.9:69",
				Timestamp: time.Now(),
				Inner:     ok,
			}.Error()
		}

		buffer := bytes.NewBuffer(boards.Result)

		_, ok = client.WriteFile(string(notification.Event()), tftp.BinaryMode, buffer)

	default:
		ErrInvalidBoardEvent{
			Event:     notification.Event(),
			Timestamp: time.Now(),
		}.Error()
	}
}

func (boards *Boards) SetAPI(api abstraction.BoardAPI) {
	boards.BoardAPI = api
}
