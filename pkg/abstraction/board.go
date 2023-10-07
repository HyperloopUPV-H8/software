package abstraction

type BoardEvent string

type BoardNotification interface {
	Event() BoardEvent
}

type BoardId uint16

type Board interface {
	Id() BoardId
	Notify(BoardNotification)
}
