package protection

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet"
)

type Packet struct {
	id         abstraction.PacketId
	BoardId    abstraction.BoardId `json:"boardId"`
	Timestamp  packet.Timestamp    `json:"timestamp"`
	Protection Protection          `json:"protection"`
	severity   severity
}

func (packet *Packet) Severity() severity {
	return packet.severity
}

func (packet *Packet) Id() abstraction.PacketId {
	return packet.id
}

type ProtectionName string

type Protection struct {
	Name ProtectionName `json:"name"`
	Type kind           `json:"type"`
	Data ProtectionData `json:"data"`
}
