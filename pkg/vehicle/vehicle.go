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

// Notification is the method invoked by transport to notify of a new event (e.g.packet received)
func (vehicle *Vehicle) Notification(notification abstraction.TransportNotification) {}

// UserPush is the method invoked by boards to signal the user has sent information to the back
func (vehicle *Vehicle) UserPush(push abstraction.BrokerPush) {}

// Request is the method invoked by a board to ask for a resource from the frontend
func (vehicle *Vehicle) Request(abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
	panic("TODO")
}

// SendMessage is the method invoked by a board to send a message
func (vehicle *Vehicle) SendMessage(abstraction.TransportMessage) error {
	panic("TODO")
}

// SendPush is the method invoked by a board to send a message to the frontend
func (vehicle *Vehicle) SendPush(abstraction.BrokerPush) error {
	panic("TODO")
}
