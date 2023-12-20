package broker

import "github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"

var _ abstraction.Broker = &Broker{}

type Broker struct {
	api abstraction.BrokerAPI
}

func (broker *Broker) Push(push abstraction.BrokerPush) error {
	panic("TODO!")
}

func (broker *Broker) Pull(req abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
	panic("TODO!")
}

func (broker *Broker) SetAPI(api abstraction.BrokerAPI) {
	broker.api = api
}
