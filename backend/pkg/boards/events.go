package boards

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type AckNotification struct {
	ID abstraction.BoardEvent // AckId
}

func (ack AckNotification) Event() abstraction.BoardEvent {
	return ack.ID
}

type DownloadEvent struct {
	EventID abstraction.BoardEvent // DownloadId
	BoardID abstraction.BoardId
}

func (download DownloadEvent) Event() abstraction.BoardEvent {
	return download.EventID
}

type UploadEvent struct {
	EventID abstraction.BoardEvent // UploadId
	BoardID abstraction.BoardId
	Data    []byte
}

func (upload UploadEvent) Event() abstraction.BoardEvent {
	return upload.EventID
}

type BoardPush struct {
	ID   abstraction.BrokerTopic // BlcuOrderId
	Data []byte
}

func (boardPush BoardPush) Topic() abstraction.BrokerTopic {
	return boardPush.ID
}

type DownloadSuccess struct {
	ID   abstraction.BrokerTopic // DSuccess
	Data []byte
}

func (downloadSuccess DownloadSuccess) Topic() abstraction.BrokerTopic {
	return downloadSuccess.ID
}

type UploadSuccess struct {
	ID abstraction.BrokerTopic // USuccess
}

func (uploadSuccess UploadSuccess) Topic() abstraction.BrokerTopic {
	return uploadSuccess.ID
}

type DownloadFailure struct {
	ID    abstraction.BrokerTopic // DFailure
	Error error
}

func (downloadFailure DownloadFailure) Topic() abstraction.BrokerTopic {
	return downloadFailure.ID
}

type UploadFailure struct {
	ID    abstraction.BrokerTopic // UFailure
	Error error
}

func (uploadFailure UploadFailure) Topic() abstraction.BrokerTopic {
	return uploadFailure.ID
}

type BoardMessage struct {
	ID abstraction.TransportEvent // UploadName
}

func (boardMessage BoardMessage) Event() abstraction.TransportEvent {
	return boardMessage.ID
}
