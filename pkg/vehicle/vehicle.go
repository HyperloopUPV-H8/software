package vehicle

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport"
)

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
	transport abstraction.Transport
	logger    Logger
}

func (vehicle *Vehicle) sendPacket(packet abstraction.Packet) error {
	return vehicle.transport.SendMessage(transport.NewPacketMessage(packet))
}
