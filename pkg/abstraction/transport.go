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
	SendMessage(TransportMessage) error
	SetAPI(TransportAPI)
}

type TransportAPI interface {
	Notification(TransportNotification)
}
