package order

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker/websocket"
)

const StateName abstraction.BrokerTopic = "order/stateOrders"

type State struct {
	pool *websocket.Pool
	api  abstraction.BrokerAPI
}

func (state *State) Topic() abstraction.BrokerTopic {
	return StateName
}

func (state *State) Push(push abstraction.BrokerPush) error {
	return nil
}

func (state *State) Pull(request abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
	return nil, nil
}

func (state *State) SetPool(pool *websocket.Pool) {
	state.pool = pool
}

func (state *State) SetAPI(api abstraction.BrokerAPI) {
	state.api = api
}
