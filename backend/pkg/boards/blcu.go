package boards

import (
	"bytes"
	"fmt"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/tftp"
	dataPacket "github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/data"
)

// TODO! Get from ADE
const (
	BlcuName = "BLCU"
	BlcuId   = abstraction.BoardId(1)

	AckId           = abstraction.BoardEvent("ACK")
	DownloadEventId = abstraction.BoardEvent("DOWNLOAD")
	UploadEventId   = abstraction.BoardEvent("UPLOAD")

	BlcuDownloadOrderId = 701
	BlcuUploadOrderId   = 700
)

type TFTPConfig struct {
	BlockSize      int
	Retries        int
	TimeoutMs      int
	BackoffFactor  int
	EnableProgress bool
}

type BLCU struct {
	api        abstraction.BoardAPI
	ackChan    chan struct{}
	ip         string
	tftpConfig TFTPConfig
}

func New(ip string) *BLCU {
	return NewWithTFTPConfig(ip, TFTPConfig{
		BlockSize:      131072, // 128kB
		Retries:        3,
		TimeoutMs:      5000,
		BackoffFactor:  2,
		EnableProgress: true,
	})
}

func NewWithTFTPConfig(ip string, tftpConfig TFTPConfig) *BLCU {
	return &BLCU{
		ackChan:    make(chan struct{}),
		ip:         ip,
		tftpConfig: tftpConfig,
	}
}
func (boards *BLCU) Id() abstraction.BoardId {
	return BlcuId
}

func (boards *BLCU) Notify(boardNotification abstraction.BoardNotification) {
	switch notification := boardNotification.(type) {
	case *AckNotification:
		boards.ackChan <- struct{}{}

	case *DownloadEvent:
		err := boards.download(*notification)
		if err != nil {
			fmt.Println(ErrDownloadFailure{
				Timestamp: time.Now(),
				Inner:     err,
			}.Error())
		}
	case *UploadEvent:
		err := boards.upload(*notification)
		if err != nil {
			fmt.Println(ErrUploadFailure{
				Timestamp: time.Now(),
				Inner:     err,
			}.Error())
		}
	default:
		fmt.Println(ErrInvalidBoardEvent{
			Event:     notification.Event(),
			Timestamp: time.Now(),
		}.Error())
	}
}

func (boards *BLCU) SetAPI(api abstraction.BoardAPI) {
	boards.api = api
}

func (boards *BLCU) download(notification DownloadEvent) error {
	// Notify the BLCU
	ping := dataPacket.NewPacketWithValues(
		abstraction.PacketId(BlcuDownloadOrderId),
		map[dataPacket.ValueName]dataPacket.Value{
			BlcuName: dataPacket.NewEnumValue(dataPacket.EnumVariant(notification.Board)),
		},
		map[dataPacket.ValueName]bool{
			BlcuName: true,
		})

	err := boards.api.SendMessage(transport.NewPacketMessage(ping))
	if err != nil {
		return ErrSendMessageFailed{
			Timestamp: time.Now(),
			Inner:     err,
		}
	}

	// Wait for the ACK
	<-boards.ackChan

	// TODO! Notify on progress

	client, err := tftp.NewClient(boards.ip,
		tftp.WithBlockSize(boards.tftpConfig.BlockSize),
		tftp.WithRetries(boards.tftpConfig.Retries),
		tftp.WithTimeout(time.Duration(boards.tftpConfig.TimeoutMs)*time.Millisecond),
	)
	if err != nil {
		return ErrNewClientFailed{
			Addr:      boards.ip,
			Timestamp: time.Now(),
			Inner:     err,
		}
	}

	buffer := &bytes.Buffer{}

	_, err = client.ReadFile(BlcuName, tftp.BinaryMode, buffer)
	if err != nil {
		pushErr := boards.api.SendPush(abstraction.BrokerPush(
			&DownloadFailure{
				Error: err,
			},
		))
		if pushErr != nil {
			return ErrSendMessageFailed{
				Timestamp: time.Now(),
				Inner:     pushErr,
			}
		}

		return ErrReadingFileFailed{
			Filename:  string(notification.Event()),
			Timestamp: time.Now(),
			Inner:     err,
		}
	}

	pushErr := boards.api.SendPush(abstraction.BrokerPush(
		&DownloadSuccess{
			Data: buffer.Bytes(),
		},
	))
	if pushErr != nil {
		return ErrSendMessageFailed{
			Timestamp: time.Now(),
			Inner:     err,
		}
	}

	return nil
}

func (boards *BLCU) upload(notification UploadEvent) error {
	ping := dataPacket.NewPacketWithValues(abstraction.PacketId(BlcuUploadOrderId),
		map[dataPacket.ValueName]dataPacket.Value{
			BlcuName: dataPacket.NewEnumValue(dataPacket.EnumVariant(notification.Board)),
		},
		map[dataPacket.ValueName]bool{
			BlcuName: true,
		})

	err := boards.api.SendMessage(transport.NewPacketMessage(ping))
	if err != nil {
		return ErrSendMessageFailed{
			Timestamp: time.Now(),
			Inner:     err,
		}
	}

	<-boards.ackChan

	// TODO! Notify on progress

	client, err := tftp.NewClient(boards.ip,
		tftp.WithBlockSize(boards.tftpConfig.BlockSize),
		tftp.WithRetries(boards.tftpConfig.Retries),
		tftp.WithTimeout(time.Duration(boards.tftpConfig.TimeoutMs)*time.Millisecond),
	)
	if err != nil {
		return ErrNewClientFailed{
			Addr:      boards.ip,
			Timestamp: time.Now(),
			Inner:     err,
		}
	}

	data := notification.Data
	buffer := bytes.NewBuffer(data)

	read, err := client.WriteFile(BlcuName, tftp.BinaryMode, buffer)
	if err != nil {
		pushErr := boards.api.SendPush(abstraction.BrokerPush(
			&UploadFailure{
				Error: err,
			}))
		if pushErr != nil {
			return ErrSendMessageFailed{
				Timestamp: time.Now(),
				Inner:     pushErr,
			}
		}

		return ErrReadingFileFailed{
			Filename:  string(notification.Event()),
			Timestamp: time.Now(),
			Inner:     err,
		}
	}

	// Check if all bytes written
	if int(read) != len(data) {
		err = ErrNotAllBytesWritten{
			Timestamp: time.Now(),
		}

		pushErr := boards.api.SendPush(abstraction.BrokerPush(
			&UploadFailure{
				Error: err,
			}))
		if pushErr != nil {
			return ErrSendMessageFailed{
				Timestamp: time.Now(),
				Inner:     pushErr,
			}
		}

		return err
	}

	pushErr := boards.api.SendPush(abstraction.BrokerPush(
		&UploadSuccess{}))
	if pushErr != nil {
		return ErrSendMessageFailed{
			Timestamp: time.Now(),
			Inner:     pushErr,
		}
	}
	return nil
}
