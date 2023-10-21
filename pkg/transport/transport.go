package transport

import "github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"

type Transport struct {
	api abstraction.TransportAPI
}

func (transport *Transport) SendMessage(message abstraction.TransportMessage) error {
	panic("TODO!")
}

func (transport *Transport) SetAPI(api abstraction.TransportAPI) {
	transport.api = api
}
