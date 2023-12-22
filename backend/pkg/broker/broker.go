package broker

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker/websocket"
)

var _ abstraction.Broker = &Broker{}

type Broker struct {
	topics  map[abstraction.BrokerTopic]topics.Handler
	clients *websocket.Pool
	api     abstraction.BrokerAPI
}

func (broker *Broker) Push(push abstraction.BrokerPush) error {
	topic, ok := broker.topics[push.Topic()]
	if !ok {
		return ErrTopicNotFound{
			Topic: push.Topic(),
		}
	}

	return topic.Push(push)
}

func (broker *Broker) Pull(request abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
	topic, ok := broker.topics[request.Topic()]
	if !ok {
		return nil, ErrTopicNotFound{
			Topic: request.Topic(),
		}
	}

	return topic.Pull(request)
}

func (broker *Broker) SetAPI(api abstraction.BrokerAPI) {
	broker.api = api
}

func (broker *Broker) SetPool(pool *websocket.Pool) {
	broker.clients = pool
	for _, topic := range broker.topics {
		topic.SetPool(pool)
	}
}

func (broker *Broker) AddTopic(topic abstraction.BrokerTopic, handler topics.Handler) {
	handler.SetAPI(broker)
	handler.SetPool(broker.clients)
	broker.topics[topic] = handler
}

func (broker *Broker) UserPush(push abstraction.BrokerPush) {
	broker.api.UserPush(push)
}
