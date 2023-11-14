package info

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet"
)

type infoData string

type Packet struct {
	id        abstraction.PacketId
	BoardId   abstraction.BoardId `json:"boardId"`
	Timestamp packet.Timestamp    `json:"timestamp"`
	Msg       infoData            `json:"msg"`
}

func (packet *Packet) Id() abstraction.PacketId {
	return packet.id
}
