package boards

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
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

type BlcuPing struct {
	ID abstraction.TransportEvent // BlcuOrderId
}

func (blcuPing *BlcuPing) Event() abstraction.TransportEvent {
	return blcuPing.ID
}

type BoardPush struct {
	ID   abstraction.BrokerTopic // DownloadName
	Data []byte
}

func (boardPush *BoardPush) Topic() abstraction.BrokerTopic {
	return boardPush.ID
}

type BoardMessage struct {
	ID abstraction.TransportEvent // UploadName
}

func (boardMessage *BoardMessage) Event() abstraction.TransportEvent {
	return boardMessage.ID
}
