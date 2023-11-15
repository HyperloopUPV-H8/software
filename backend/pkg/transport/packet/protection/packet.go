package protection

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet"
)

// Packet represents a protection packet.
//
// protection packets are encoded as json.
type Packet struct {
	id         abstraction.PacketId
	BoardId    abstraction.BoardId `json:"boardId"`
	Timestamp  packet.Timestamp    `json:"timestamp"`
	Protection Protection          `json:"protection"`
	severity   severity
}

// Severity returns the protection severity
func (packet *Packet) Severity() severity {
	return packet.severity
}

// Id returns the packet id
func (packet *Packet) Id() abstraction.PacketId {
	return packet.id
}

// ProtectionName is a name given to a protection to identify them
type ProtectionName string

// Protection is the data of the proteciton that got thrown
type Protection struct {
	Name ProtectionName `json:"name"`
	Type kind           `json:"type"`
	Data ProtectionData `json:"data"`
}
