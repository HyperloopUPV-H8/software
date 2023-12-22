package data

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker/websocket"
)

const EnableName abstraction.BrokerTopic = "logger/enable"

type Enable struct {
	pool *websocket.Pool
	api  abstraction.BrokerAPI
}

func (enable *Enable) Topic() abstraction.BrokerTopic {
	return EnableName
}

func (enable *Enable) Push(push abstraction.BrokerPush) error {
	return nil
}

func (enable *Enable) Pull(request abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
	return nil, nil
}

func (enable *Enable) SetPool(pool *websocket.Pool) {
	enable.pool = pool
}

func (enable *Enable) SetAPI(api abstraction.BrokerAPI) {
	enable.api = api
}
