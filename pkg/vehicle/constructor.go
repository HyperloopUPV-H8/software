package vehicle

func New() Vehicle {
	return Vehicle{
		boards: make(map[BoardId]Board),
	}
}

func (vehicle *Vehicle) SetBroker(broker Broker) {
	vehicle.broker = broker
}

func (vehicle *Vehicle) AddBoard(board Board) {
	vehicle.boards[board.Id()] = board
}

func (vehicle *Vehicle) RemoveBoard(board Board) {
	delete(vehicle.boards, board.Id())
}

func (vehicle *Vehicle) RemoveBoardId(id BoardId) {
	delete(vehicle.boards, id)
}

func (vehicle *Vehicle) SetTransport(transport Transport) {
	vehicle.transport = transport
}

func (vehicle *Vehicle) SetLogger(logger Logger) {
	vehicle.logger = logger
}
