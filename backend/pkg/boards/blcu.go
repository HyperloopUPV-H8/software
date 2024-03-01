package boards

import (
	"bytes"
	"encoding/binary"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/tftp"
	dataPacket "github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/data"
	"time"
)

// TODO! Get from ADE
const (
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
}

func New(Id string) *BLCU {
	return &BLCU{
		boardId: Id,
		arkChan: make(chan struct{}),
	}
}
func (boards *BLCU) Id() string {
	return boards.boardId
}

func (boards *BLCU) Notify(notification abstraction.BoardNotification) {
	switch notification := notification.(type) {
	case AckNotification:
		boards.arkChan <- struct{}{}

	case DownloadEvent:
		dataPacket.NewPacketWithValues(abstraction.PacketId(BlcuOrderId),
			make(map[dataPacket.ValueName]dataPacket.Value),
			make(map[dataPacket.ValueName]bool))

		<-boards.arkChan

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

		err := boards.api.SendPush(abstraction.BrokerPush(
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

	case UploadEvent:
		dataPacket.NewPacketWithValues(abstraction.PacketId(BlcuOrderId),
			make(map[dataPacket.ValueName]dataPacket.Value),
			make(map[dataPacket.ValueName]bool))

		<-boards.arkChan

		client, ok := tftp.NewClient("192.168.0.9:69")
		if ok != nil {
			ErrNewClientFailed{
				Addr:      "192.168.0.9:69",
				Timestamp: time.Now(),
				Inner:     ok,
			}.Error()
		}

		buffer := bytes.NewBuffer(boards.tempData)

		_, ok = client.WriteFile(string(notification.Event()), tftp.BinaryMode, buffer)
		if ok != nil {
			ErrReadingFileFailed{
				Filename:  string(notification.Event()),
				Timestamp: time.Now(),
				Inner:     ok,
			}.Error()
		}

		err := boards.api.SendMessage(abstraction.TransportMessage(
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

func (boards *BLCU) SetAPI(api abstraction.BoardAPI) {
	boards.api = api
}
