package vehicle

type Broker interface {
}

type BoardId uint16
type Board interface {
	Id() BoardId
}

type Transport interface {
}

type Logger interface {
}

type Vehicle struct {
	broker    Broker
	boards    map[BoardId]Board
	transport Transport
	logger    Logger
}
