package blcu

import (
	"encoding/json"
	"fmt"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/boards"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
)

const UploadName abstraction.BrokerTopic = "blcu/upload"

type Upload struct {
	pool   *websocket.Pool
	api    abstraction.BrokerAPI
	client websocket.ClientId
}

func (upload *Upload) Topic() abstraction.BrokerTopic {
	return UploadName
}

func (upload *Upload) Push(push abstraction.BrokerPush) error {
	// Switch success/failure
	// upload.pool.Write(ID, message)

	switch push.Topic() {
	case boards.UploadSuccess{}.Topic():
		err := upload.pool.Write(upload.client, websocket.Message{
			Topic:   push.Topic(),
			Payload: nil,
		})
		if err != nil {
			return err
		}

	case boards.UploadFailure{}.Topic():
		err := upload.pool.Write(upload.client, websocket.Message{
			Topic:   push.Topic(),
			Payload: nil,
		})
		if err != nil {
			return err
		}
	}

	return nil
}

func (upload *Upload) Pull(request abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
	return nil, nil
}

func (upload *Upload) ClientMessage(id websocket.ClientId, message *websocket.Message) {
	upload.client = id

	switch message.Topic {
	case UploadName:
		err := upload.handleUpload(message)
		if err != nil {
			fmt.Printf("error handling download: %v\n", err)
		}
	}
}

func (upload *Upload) handleUpload(message *websocket.Message) error {
	var uploadEvent boards.UploadEvent
	err := json.Unmarshal(message.Payload, &uploadEvent)
	if err != nil {
		return err
	}

	pushErr := upload.api.UserPush(&uploadEvent)
	return pushErr
}

func (upload *Upload) SetPool(pool *websocket.Pool) {
	upload.pool = pool
}

func (upload *Upload) SetAPI(api abstraction.BrokerAPI) {
	upload.api = api
}
