package blcu

import "github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"

// Ack is the blcu Ack message sent when the blcu is ready to create a tftp connection.
//
// the packet just has the ID.
type Ack struct {
	id abstraction.PacketId
}

// Id returns the ID of the packet
func (packet *Ack) Id() abstraction.PacketId {
	return packet.id
}
