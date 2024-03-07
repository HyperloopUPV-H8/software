package boards

import (
	"bytes"
	"fmt"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/tftp"
	dataPacket "github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/data"
	"time"
)

// TODO! Get from ADE
const (
	BlcuName = "BLCU"
	BlcuId   = abstraction.BoardId(1)

	AckId      = "1"
	DownloadId = "2"
	UploadId   = "3"

	BlcuDownloadOrderId = 1
	BlcuUploadOrderId   = 2

	DownloadName = "download"
	UploadName   = "upload"

	DSuccess = "download success"
	USuccess = "upload success"
)

type BLCU struct {
	api     abstraction.BoardAPI
	ackChan chan struct{}
	ip      string
}

func New(ip string) *BLCU {
	return &BLCU{
		ackChan: make(chan struct{}),
		ip:      ip,
	}
}
func (boards *BLCU) Id() abstraction.BoardId {
	return BlcuId
}

func (boards *BLCU) Notify(notification abstraction.BoardNotification) {
	switch notification := notification.(type) {
	case AckNotification:
		boards.ackChan <- struct{}{}

	case DownloadEvent:
		err := boards.download(notification)
		if err != nil {
			fmt.Printf(ErrDownloadFailure{
				Timestamp: time.Now(),
				Inner:     err,
			}.Error())
		}
	case UploadEvent:
		err := boards.upload(notification)
		if err != nil {
			fmt.Printf(ErrDownloadFailure{
				Timestamp: time.Now(),
				Inner:     err,
			}.Error())
		}
	default:
		fmt.Printf(ErrInvalidBoardEvent{
			Event:     notification.Event(),
			Timestamp: time.Now(),
		}.Error())
	}
}

func (boards *BLCU) SetAPI(api abstraction.BoardAPI) {
	boards.api = api
}

func (boards *BLCU) download(notification abstraction.BoardNotification) error {
	// Notify the BLCU

	// TODO! Ask for message procedure
	ping := dataPacket.NewPacketWithValues(abstraction.PacketId(BlcuDownloadOrderId),
		make(map[dataPacket.ValueName]dataPacket.Value),
		make(map[dataPacket.ValueName]bool))

	err := boards.api.SendMessage(transport.NewPacketMessage(ping))
	if err != nil {
		fmt.Printf(ErrSendMessageFailed{
			Timestamp: time.Now(),
			Inner:     err,
		}.Error())

		return err
	}

	// Wait for the ACK
	<-boards.ackChan

	// TODO! Notify on progress

	client, err := tftp.NewClient(boards.ip)
	if err != nil {
		fmt.Printf(ErrNewClientFailed{
			Addr:      boards.ip,
			Timestamp: time.Now(),
			Inner:     err,
		}.Error())

		return err
	}

	buffer := &bytes.Buffer{}

	_, err = client.ReadFile(BlcuName, tftp.BinaryMode, buffer)
	if err != nil {
		pushErr := boards.api.SendPush(abstraction.BrokerPush(
			&DownloadFailure{
				ID:    DownloadName,
				Error: err,
			},
		))
		if pushErr != nil {
			fmt.Printf(ErrSendMessageFailed{
				Timestamp: time.Now(),
				Inner:     pushErr,
			}.Error())

			return pushErr
		}

		fmt.Printf(ErrReadingFileFailed{
			Filename:  string(notification.Event()),
			Timestamp: time.Now(),
			Inner:     err,
		}.Error())

		return err
	}

	pushErr := boards.api.SendPush(abstraction.BrokerPush(
		&DownloadSuccess{
			ID:   DownloadName,
			Data: buffer.Bytes(),
		},
	))
	if pushErr != nil {
		fmt.Printf(ErrSendMessageFailed{
			Timestamp: time.Now(),
			Inner:     err,
		}.Error())

		return pushErr
	}

	return err
}

func (boards *BLCU) upload(notification abstraction.BoardNotification) error {
	ping := dataPacket.NewPacketWithValues(abstraction.PacketId(BlcuUploadOrderId),
		make(map[dataPacket.ValueName]dataPacket.Value),
		make(map[dataPacket.ValueName]bool))

	err := boards.api.SendMessage(transport.NewPacketMessage(ping))
	if err != nil {
		fmt.Printf(ErrSendMessageFailed{
			Timestamp: time.Now(),
			Inner:     err,
		}.Error())

		return err
	}

	<-boards.ackChan

	// TODO! Notify on progress

	client, err := tftp.NewClient(boards.ip)
	if err != nil {
		fmt.Printf(ErrNewClientFailed{
			Addr:      boards.ip,
			Timestamp: time.Now(),
			Inner:     err,
		}.Error())
	}

	data := notification.(UploadEvent).Data
	buffer := bytes.NewBuffer(data)

	read, err := client.WriteFile(BlcuName, tftp.BinaryMode, buffer)
	if err != nil {
		pushErr := boards.api.SendPush(abstraction.BrokerPush(
			&UploadFailure{
				ID:    UploadName,
				Error: err,
			}))
		if pushErr != nil {
			fmt.Printf(ErrSendMessageFailed{
				Timestamp: time.Now(),
				Inner:     pushErr,
			}.Error())

			return pushErr
		}

		fmt.Printf(ErrReadingFileFailed{
			Filename:  string(notification.Event()),
			Timestamp: time.Now(),
			Inner:     err,
		}.Error())

		return err
	}

	// Check if all bytes written
	if int(read) != len(data) {
		fmt.Printf(ErrNotAllBytesWritten{
			Timestamp: time.Now(),
		}.Error())
	}

	pushErr := boards.api.SendPush(abstraction.BrokerPush(
		&UploadSuccess{
			ID: UploadName,
		}))
	if pushErr != nil {
		fmt.Printf(ErrSendMessageFailed{
			Timestamp: time.Now(),
			Inner:     pushErr,
		}.Error())

		return pushErr
	}
	return err
}
