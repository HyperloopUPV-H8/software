package abstraction

type TransportEvent string
type TransportTarget uint16

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
