package topics

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
)

type Handler interface {
	UserPush(abstraction.BrokerPush) error
	UserPull(abstraction.BrokerRequest) (abstraction.BrokerResponse, error)
	ClientMessage(websocket.ClientId, *websocket.Message)
	SetPool(*websocket.Pool)
	SetAPI(abstraction.BrokerAPI)
}
