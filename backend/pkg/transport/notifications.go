package transport

import "github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"

// PacketNofitication notifies of an incoming message
type PacketNotification struct {
	abstraction.Packet
}

func NewPacketNotification(packet abstraction.Packet) PacketNotification {
	return PacketNotification{
		Packet: packet,
	}
}

// Event always returns PacketEvent
func (notification PacketNotification) Event() abstraction.TransportEvent {
	return PacketEvent
}
