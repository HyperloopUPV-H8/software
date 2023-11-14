package state

import "github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"

type Packet struct {
	id    abstraction.PacketId
	state [8][15]float32
}

func (packet *Packet) Id() abstraction.PacketId {
	return packet.id
}

func (packet *Packet) State() [8][15]float32 {
	return packet.state
}
