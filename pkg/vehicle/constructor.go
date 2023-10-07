package vehicle

import "github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"

func New() Vehicle {
	return Vehicle{
		boards: make(map[abstraction.BoardId]abstraction.Board),
	}
}

func (vehicle *Vehicle) SetBroker(broker abstraction.Broker) {
	broker.SetAPI(vehicle)
	vehicle.broker = broker
}

func (vehicle *Vehicle) AddBoard(board abstraction.Board) {
	board.SetAPI(vehicle)
	vehicle.boards[board.Id()] = board
}

func (vehicle *Vehicle) RemoveBoard(board abstraction.Board) {
	delete(vehicle.boards, board.Id())
}

func (vehicle *Vehicle) RemoveBoardId(id abstraction.BoardId) {
	delete(vehicle.boards, id)
}

func (vehicle *Vehicle) SetTransport(transport abstraction.Transport) {
	transport.SetAPI(vehicle)
	vehicle.transport = transport
}

func (vehicle *Vehicle) SetLogger(logger abstraction.Logger) {
	vehicle.logger = logger
}
