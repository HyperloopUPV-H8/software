package state

import "github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"

type Space struct {
	id    abstraction.PacketId
	state [8][15]float32
}

func (packet *Space) Id() abstraction.PacketId {
	return packet.id
}

func (packet *Space) State() [8][15]float32 {
	return packet.state
}
