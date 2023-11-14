package protection

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type Timestamp struct {
	Counter uint16 `json:"counter"`
	Second  uint8  `json:"second"`
	Minute  uint8  `json:"minute"`
	Hour    uint8  `json:"hour"`
	Day     uint8  `json:"day"`
	Month   uint8  `json:"month"`
	Year    uint16 `json:"year"`
}

type Packet struct {
	id         abstraction.PacketId
	BoardId    abstraction.BoardId `json:"boardId"`
	Timestamp  Timestamp           `json:"timestamp"`
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
