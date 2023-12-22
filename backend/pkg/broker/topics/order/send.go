package order

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker/websocket"
)

const SendName abstraction.BrokerTopic = "order/send"

type Send struct {
	pool *websocket.Pool
	api  abstraction.BrokerAPI
}

func (send *Send) Topic() abstraction.BrokerTopic {
	return SendName
}

func (send *Send) Push(push abstraction.BrokerPush) error {
	return nil
}

func (send *Send) Pull(request abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
	return nil, nil
}

func (send *Send) SetPool(pool *websocket.Pool) {
	send.pool = pool
}

func (send *Send) SetAPI(api abstraction.BrokerAPI) {
	send.api = api
}
