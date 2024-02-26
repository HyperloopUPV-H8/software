package boards

import (
	"bytes"
	"encoding/binary"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/tftp"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/vehicle"
	"time"
)

const (
	AckId      = "1"
	DownloadId = "2"
	UploadId   = "3"

	BlcuOrderId = "blcu"
)

type AckNot struct {
	ID abstraction.BoardEvent // AckId
}

func (ack *AckNot) Event() abstraction.BoardEvent {
	return ack.ID
}

type DownloadNot struct {
	ID abstraction.BoardEvent // DownloadId
}

func (download *DownloadNot) Event() abstraction.BoardEvent {
	return download.ID
}

type UploadNot struct {
	ID   abstraction.BoardEvent // UploadId
	Data []byte
}

func (upload *UploadNot) Event() abstraction.BoardEvent {
	return upload.ID
}

type Boards struct {
	BoardId  string
	BoardAPI abstraction.BoardAPI
	// Data to be either uploaded to a board or downloaded from a board
	Data    []byte
	AckChan chan struct{}
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
	case AckId:
		boards.AckChan <- struct{}{}

	case DownloadId:
		err := vehicle.Vehicle.SendMessage() // TODO: Implement SendMessage
		if err != nil {
			ErrSendMessageFailed{
				Timestamp: time.Now(),
				Inner:     err,
			}.Error()
		}

		client, ok := tftp.NewClient("192.168.0.9:69")
		if ok != nil {
			ErrNewClientFailed{
				Addr:      "192.168.0.9:69",
				Timestamp: time.Now(),
				Inner:     ok,
			}.Error()
		}

		buffer := &bytes.Buffer{}

		data, ok := client.ReadFile(string(notification.Event()), tftp.BinaryMode, buffer)
		if ok != nil {
			ErrReadingFileFailed{
				Filename:  string(notification.Event()),
				Timestamp: time.Now(),
				Inner:     ok,
			}.Error()
		}

		b := make([]byte, 8)
		binary.LittleEndian.PutUint64(b, uint64(data))
		boards.Data = b

	case UploadId:
		err := vehicle.Vehicle.SendMessage() // TODO: Implement SendMessage
		if err != nil {
			ErrSendMessageFailed{
				Timestamp: time.Now(),
				Inner:     err,
			}.Error()
		}

		client, ok := tftp.NewClient("192.168.0.9:69")
		if ok != nil {
			ErrNewClientFailed{
				Addr:      "192.168.0.9:69",
				Timestamp: time.Now(),
				Inner:     ok,
			}.Error()
		}

		buffer := bytes.NewBuffer(boards.Data)

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
