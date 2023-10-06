package abstraction

type BrokerTopic string

type BrokerPush interface {
	Topic() BrokerTopic
}

type BrokerRequest interface {
	Topic() BrokerTopic
}

type BrokerResponse interface {
	Topic() BrokerTopic
}

type Broker interface {
	Push(BrokerPush) error
	Pull(BrokerRequest) (BrokerResponse, error)
}
