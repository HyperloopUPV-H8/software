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
	BoardName = "BLCU"
	BoardId   = abstraction.BoardId(1)

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
	api      abstraction.BoardAPI
	tempData []byte
	ackChan  chan struct{}
	ip       string
}

func New(ip string) *BLCU {
	return &BLCU{
		ackChan: make(chan struct{}),
		ip:      ip,
	}
}
func (boards *BLCU) Id() abstraction.BoardId {
	return BoardId
}

func (boards *BLCU) Notify(notification abstraction.BoardNotification) {
	switch notification := notification.(type) {
	case AckNotification:
		boards.ackChan <- struct{}{}

	case DownloadEvent:
		err := boards.download(notification)
		if err != nil {
			ErrDownloadFailure{
				Timestamp: time.Now(),
				Inner:     err,
			}.String()
		}
	case UploadEvent:
		err := boards.upload(notification)
		if err != nil {
			ErrDownloadFailure{
				Timestamp: time.Now(),
				Inner:     err,
			}.String()
		}
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

func (boards *BLCU) download(notification abstraction.BoardNotification) error {
	// Notify the BLCU
	dataPacket.NewPacketWithValues(abstraction.PacketId(BlcuOrderId),
		make(map[dataPacket.ValueName]dataPacket.Value),
		make(map[dataPacket.ValueName]bool))

	// Wait for the ACK
	<-boards.ackChan

	// TODO! Notify on progress

	client, err := tftp.NewClient(boards.ip)
	if err != nil {
		ErrNewClientFailed{
			Addr:      boards.ip,
			Timestamp: time.Now(),
			Inner:     err,
		}.String()

		return err
	}

	buffer := &bytes.Buffer{}

	data, err := client.ReadFile(BoardName, tftp.BinaryMode, buffer)
	if err != nil {
		pushErr := boards.api.SendPush(abstraction.BrokerPush(
			&DownloadFailure{
				ID:    DownloadName,
				Error: err,
			},
		))
		if pushErr != nil {
			ErrSendMessageFailed{
				Timestamp: time.Now(),
				Inner:     pushErr,
			}.String()

			return pushErr
		}

		ErrReadingFileFailed{
			Filename:  string(notification.Event()),
			Timestamp: time.Now(),
			Inner:     err,
		}.String()

		return err
	}

	pushErr := boards.api.SendPush(abstraction.BrokerPush(
		&DownloadSuccess{
			ID:   DownloadName,
			Data: data,
		},
	))
	if pushErr != nil {
		ErrSendMessageFailed{
			Timestamp: time.Now(),
			Inner:     err,
		}.String()

		return pushErr
	}

	return err
}

func (boards *BLCU) upload(notification abstraction.BoardNotification) error {
	dataPacket.NewPacketWithValues(abstraction.PacketId(BlcuOrderId),
		make(map[dataPacket.ValueName]dataPacket.Value),
		make(map[dataPacket.ValueName]bool))

	<-boards.ackChan

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

	read, err := client.WriteFile(BoardName, tftp.BinaryMode, buffer)
	if err != nil {
		pushErr := boards.api.SendPush(abstraction.BrokerPush(
			&UploadFailure{
				ID:    UploadName,
				Error: err,
			}))
		if pushErr != nil {
			ErrSendMessageFailed{
				Timestamp: time.Now(),
				Inner:     pushErr,
			}.String()

			return pushErr
		}

		ErrReadingFileFailed{
			Filename:  string(notification.Event()),
			Timestamp: time.Now(),
			Inner:     err,
		}.String()

		return err
	}

	// Check if all bytes written
	if int(read) != len(boards.tempData) {
		ErrNotAllBytesWritten{
			Timestamp: time.Now(),
		}.String()
	}

	pushErr := boards.api.SendPush(abstraction.BrokerPush(
		&UploadSuccess{
			ID: UploadName,
		}))
	if pushErr != nil {
		ErrSendMessageFailed{
			Timestamp: time.Now(),
			Inner:     pushErr,
		}.String()

		return pushErr
	}
	return err
}
