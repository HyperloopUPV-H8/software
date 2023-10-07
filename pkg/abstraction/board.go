package abstraction

type BoardEvent string

type BoardNotification interface {
	Event() BoardEvent
}

type BoardId uint16

type Board interface {
	Id() BoardId
	Notify(BoardNotification)
	SetAPI(BoardAPI)
}

type BoardAPI interface {
	Request(BrokerRequest) (BrokerResponse, error)
	SendMessage(TransportMessage) error
	SendPush(BrokerPush) error
}
