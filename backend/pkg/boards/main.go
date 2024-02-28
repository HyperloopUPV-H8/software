package boards

import (
	"bytes"
	"encoding/binary"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/tftp"
	"time"
)

const (
	AckId      = "1"
	DownloadId = "2"
	UploadId   = "3"

	BlcuOrderId = "blcu order"

	DownloadName = "download"
	UploadName   = "upload"

	DSuccess = "download success"
	USuccess = "upload success"
)

type Boards struct {
	boardId  string
	BoardAPI abstraction.BoardAPI
	TempData []byte
	AckChan  chan struct{}
}

func New(Id string) *Boards {
	return &Boards{
		boardId: Id,
		AckChan: make(chan struct{}),
	}
}
func (boards *Boards) Id() string {
	return boards.boardId
}

func (boards *Boards) Notify(notification abstraction.BoardNotification) {
	switch notification.Event() {
	case AckId:
		boards.AckChan <- struct{}{}

	case DownloadId:
		err := boards.BoardAPI.SendMessage(abstraction.TransportMessage(
			&BlcuPing{
				ID: BlcuOrderId,
			}))
		if err != nil {
			ErrSendMessageFailed{
				Timestamp: time.Now(),
				Inner:     err,
			}.Error()
		}

		<-boards.AckChan

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

		// Convert data to uint64 (bytes)
		b := make([]byte, 8)
		binary.LittleEndian.PutUint64(b, uint64(data))

		err = boards.BoardAPI.SendPush(abstraction.BrokerPush(
			&BoardPush{
				ID:   DownloadName,
				Data: b,
			},
		))
		if err != nil {
			ErrSendMessageFailed{
				Timestamp: time.Now(),
				Inner:     err,
			}.Error()
		}

	case UploadId:
		err := boards.BoardAPI.SendMessage(abstraction.TransportMessage(
			&BlcuPing{
				ID: BlcuOrderId,
			}))
		if err != nil {
			ErrSendMessageFailed{
				Timestamp: time.Now(),
				Inner:     err,
			}.Error()
		}

		<-boards.AckChan

		client, ok := tftp.NewClient("192.168.0.9:69")
		if ok != nil {
			ErrNewClientFailed{
				Addr:      "192.168.0.9:69",
				Timestamp: time.Now(),
				Inner:     ok,
			}.Error()
		}

		buffer := bytes.NewBuffer(boards.TempData)

		_, ok = client.WriteFile(string(notification.Event()), tftp.BinaryMode, buffer)
		if ok != nil {
			ErrReadingFileFailed{
				Filename:  string(notification.Event()),
				Timestamp: time.Now(),
				Inner:     ok,
			}.Error()
		}

		err = boards.BoardAPI.SendMessage(abstraction.TransportMessage(
			&BoardMessage{
				ID: USuccess,
			},
		))
		if err != nil {
			ErrSendMessageFailed{
				Timestamp: time.Now(),
				Inner:     err,
			}.Error()

		}

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
