package order

import "github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"

type action string

const (
	ActionAdd    action = "add"
	ActionRemove action = "remove"
)

type Add struct {
	id     abstraction.PacketId
	orders []abstraction.PacketId
}

func (packet *Add) Id() abstraction.PacketId {
	return packet.id
}

func (packet *Add) Orders() []abstraction.PacketId {
	return packet.orders
}

func (packet *Add) Action() action {
	return ActionAdd
}

type Remove struct {
	id     abstraction.PacketId
	orders []abstraction.PacketId
}

func (packet *Remove) Id() abstraction.PacketId {
	return packet.id
}

func (packet *Remove) Orders() []abstraction.PacketId {
	return packet.orders
}

func (packet *Remove) Action() action {
	return ActionRemove
}
