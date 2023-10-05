package vehicle

type PacketId uint16
type Packet interface {
	Id() PacketId
}

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

type BoardEvent string
type BoardNotification interface {
	Event() BoardEvent
}

type BoardId uint16
type Board interface {
	Id() BoardId
	Notify(BoardNotification)
}

type TransportEvent string
type TransportNotification interface {
	Event() TransportEvent
}
type TransportMessage interface {
	Event() TransportEvent
}
type Transport interface {
	GetOutput() <-chan TransportNotification
	SendMessage(TransportMessage) error
}

type LoggerName string
type LoggerRecord interface {
	Name() LoggerName
}
type LoggerRequest interface {
	Name() LoggerName
}

type Logger interface {
	PushRecord(LoggerRecord) error
	PullRecord(LoggerRequest) (LoggerRecord, error)
}

type Vehicle struct {
	broker    Broker
	boards    map[BoardId]Board
	transport Transport
	logger    Logger
}
