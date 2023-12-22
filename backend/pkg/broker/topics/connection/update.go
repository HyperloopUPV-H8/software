package data

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker/websocket"
)

const UpdateName abstraction.BrokerTopic = "connection/update"

type Update struct {
	pool *websocket.Pool
	api  abstraction.BrokerAPI
}

func (update *Update) Topic() abstraction.BrokerTopic {
	return UpdateName
}

func (update *Update) Push(push abstraction.BrokerPush) error {
	return nil
}

func (update *Update) Pull(request abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
	return nil, nil
}

func (update *Update) SetPool(pool *websocket.Pool) {
	update.pool = pool
}

func (update *Update) SetAPI(api abstraction.BrokerAPI) {
	update.api = api
}
