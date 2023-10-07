package vehicle

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type Vehicle struct {
	broker    abstraction.Broker
	boards    map[abstraction.BoardId]abstraction.Board
	transport abstraction.Transport
	logger    abstraction.Logger
}

func (vehicle *Vehicle) transportNotification(notification abstraction.TransportNotification) {

}
