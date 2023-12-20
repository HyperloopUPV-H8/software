package topics

import "github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"

type Handler interface {
	Push(abstraction.BrokerPush) error
	Pull(abstraction.BrokerRequest) (abstraction.BrokerResponse, error)
	SetAPI(abstraction.BrokerAPI)
}
