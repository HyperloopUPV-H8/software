package data

import (
	"encoding/json"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
	ws "github.com/gorilla/websocket"
)

const UpdateName abstraction.BrokerTopic = "podData/update"
const SubscribeName abstraction.BrokerTopic = "podData/update"

type Update struct {
	subscribers map[websocket.ClientId]struct{}
	pool        *websocket.Pool
	api         abstraction.BrokerAPI
}

func (update *Update) Topic() abstraction.BrokerTopic {
	return UpdateName
}

func (update *Update) Push(push abstraction.BrokerPush) error {
	data, ok := push.(*Push)
	if !ok {
		return topics.ErrUnexpectedPush{Push: push}
	}

	payload := data.ToPayload()

	rawPayload, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	message := websocket.Message{
		Topic:   UpdateName,
		Payload: rawPayload,
	}

	for id := range update.subscribers {
		err := update.pool.Write(id, message)
		if err != nil {
			update.pool.Disconnect(id, ws.CloseInternalServerErr, err.Error())
		}
	}

	return nil
}

func (update *Update) Pull(request abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
	return nil, topics.ErrOpNotSupported{}
}

func (update *Update) ClientMessage(id websocket.ClientId, message *websocket.Message) {
	switch message.Topic {
	case SubscribeName:
		update.subscribers[id] = struct{}{}
	default:
		update.pool.Disconnect(id, ws.CloseUnsupportedData, "unsupported topic")
	}
}

func (update *Update) SetPool(pool *websocket.Pool) {
	update.pool = pool
}

func (update *Update) SetAPI(api abstraction.BrokerAPI) {
	update.api = api
}
