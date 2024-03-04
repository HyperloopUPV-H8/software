package boards

import (
	"bytes"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/tftp"
	dataPacket "github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/data"
	"time"
)

// TODO! Get from ADE
const (
	BoardId = abstraction.BoardId(1)

	AckId      = "1"
	DownloadId = "2"
	UploadId   = "3"

	BlcuOrderId = 1

	DownloadName = "download"
	UploadName   = "upload"

	DSuccess = "download success"
	USuccess = "upload success"
)

type BLCU struct {
	boardId  string
	api      abstraction.BoardAPI
	tempData []byte
	arkChan  chan struct{}
	ip       string
}

func New(Id string, ip string) *BLCU {
	return &BLCU{
		boardId: Id,
		arkChan: make(chan struct{}),
		ip:      ip,
	}
}
func (boards *BLCU) Id() string {
	return string(BoardId)
}

func (boards *BLCU) Notify(notification abstraction.BoardNotification) {
	switch notification := notification.(type) {
	case AckNotification:
		boards.arkChan <- struct{}{}

	case DownloadEvent:
		boards.download(notification)
	case UploadEvent:
		boards.upload(notification)

	default:
		ErrInvalidBoardEvent{
			Event:     notification.Event(),
			Timestamp: time.Now(),
		}.String()
	}
}

func (boards *BLCU) SetAPI(api abstraction.BoardAPI) {
	boards.api = api
}

func (boards *BLCU) download(notification abstraction.BoardNotification) {
	// Notify the BLCU
	dataPacket.NewPacketWithValues(abstraction.PacketId(BlcuOrderId),
		make(map[dataPacket.ValueName]dataPacket.Value),
		make(map[dataPacket.ValueName]bool))

	// Wait for the ACK
	<-boards.arkChan

	// TODO! Notify on progress

	client, err := tftp.NewClient(boards.ip)
	if err != nil {
		ErrNewClientFailed{
			Addr:      boards.ip,
			Timestamp: time.Now(),
			Inner:     err,
		}.String()
	}

	buffer := &bytes.Buffer{}

	data, err := client.ReadFile(boards.boardId, tftp.BinaryMode, buffer)
	if err != nil {
		err := boards.api.SendPush(abstraction.BrokerPush(
			&DownloadFailure{
				ID:    DownloadName,
				Error: err,
			},
		))
		if err != nil {
			ErrSendMessageFailed{
				Timestamp: time.Now(),
				Inner:     err,
			}.String()
		}

		ErrReadingFileFailed{
			Filename:  string(notification.Event()),
			Timestamp: time.Now(),
			Inner:     err,
		}.String()
	}

	err = boards.api.SendPush(abstraction.BrokerPush(
		&DownloadSuccess{
			ID:   DownloadName,
			Data: data,
		},
	))
	if err != nil {
		ErrSendMessageFailed{
			Timestamp: time.Now(),
			Inner:     err,
		}.String()
	}

}

func (boards *BLCU) upload(notification abstraction.BoardNotification) {
	dataPacket.NewPacketWithValues(abstraction.PacketId(BlcuOrderId),
		make(map[dataPacket.ValueName]dataPacket.Value),
		make(map[dataPacket.ValueName]bool))

	<-boards.arkChan

	// TODO! Notify on progress

	client, err := tftp.NewClient(boards.ip)
	if err != nil {
		ErrNewClientFailed{
			Addr:      boards.ip,
			Timestamp: time.Now(),
			Inner:     err,
		}.String()
	}

	buffer := bytes.NewBuffer(boards.tempData)

	read, err := client.WriteFile(boards.boardId, tftp.BinaryMode, buffer)
	if err != nil {
		err := boards.api.SendPush(abstraction.BrokerPush(
			&UploadFailure{
				ID:    UploadName,
				Error: err,
			}))
		if err != nil {
			ErrSendMessageFailed{
				Timestamp: time.Now(),
				Inner:     err,
			}.String()
		}

		ErrReadingFileFailed{
			Filename:  string(notification.Event()),
			Timestamp: time.Now(),
			Inner:     err,
		}.String()
	}

	// Check if all bytes written
	if int(read) != len(boards.tempData) {
		ErrNotAllBytesWritten{
			Timestamp: time.Now(),
		}.String()
	}

	err = boards.api.SendPush(abstraction.BrokerPush(
		&UploadSuccess{
			ID: UploadName,
		}))
	if err != nil {
		ErrSendMessageFailed{
			Timestamp: time.Now(),
			Inner:     err,
		}.String()
	}
}
