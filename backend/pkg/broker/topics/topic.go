package topics

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker/websocket"
)

type Handler interface {
	Push(abstraction.BrokerPush) error
	Pull(abstraction.BrokerRequest) (abstraction.BrokerResponse, error)
	SetPool(*websocket.Pool)
	SetAPI(abstraction.BrokerAPI)
}
