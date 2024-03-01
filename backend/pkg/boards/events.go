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
	ID   abstraction.BrokerTopic // DownloadName
	Data []byte
}

func (boardPush BoardPush) Topic() abstraction.BrokerTopic {
	return boardPush.ID
}

type BoardMessage struct {
	ID abstraction.TransportEvent // UploadName
}

func (boardMessage BoardMessage) Event() abstraction.TransportEvent {
	return boardMessage.ID
}
