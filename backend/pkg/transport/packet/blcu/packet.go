package blcu

import "github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"

type Ack struct {
	id abstraction.PacketId
}

func (packet *Ack) Id() abstraction.PacketId {
	return packet.id
}
