package blcu

import (
	"encoding/json"
	"fmt"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/boards"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
)

const DownloadName abstraction.BrokerTopic = "blcu/download"

type Download struct {
	pool   *websocket.Pool
	api    abstraction.BrokerAPI
	client websocket.ClientId
}

func (download *Download) Topic() abstraction.BrokerTopic {
	return DownloadName
}

func (download *Download) Push(push abstraction.BrokerPush) error {
	switch push.Topic() {
	case boards.DownloadSuccess{}.Topic():
		err := download.pool.Write(download.client, websocket.Message{
			Topic:   push.Topic(),
			Payload: nil,
		})
		if err != nil {
			return err
		}
	case boards.DownloadFailure{}.Topic():
		err := download.pool.Write(download.client, websocket.Message{
			Topic:   push.Topic(),
			Payload: nil,
		})
		if err != nil {
			return err
		}
	}

	return nil
}

func (download *Download) Pull(request abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
	return nil, nil
}

func (download *Download) ClientMessage(id websocket.ClientId, message *websocket.Message) {
	download.client = id

	switch message.Topic {
	case DownloadName:
		err := download.handleDownload(message)
		if err != nil {
			fmt.Printf("error handling download: %v\n", err)
		}
	}
}

func (download *Download) handleDownload(message *websocket.Message) error {
	var downloadEvent boards.DownloadEvent
	err := json.Unmarshal(message.Payload, &downloadEvent)
	if err != nil {
		return err
	}

	pushErr := download.api.UserPush(&downloadEvent)
	return pushErr
}

func (download *Download) SetPool(pool *websocket.Pool) {
	download.pool = pool
}

func (download *Download) SetAPI(api abstraction.BrokerAPI) {
	download.api = api
}
