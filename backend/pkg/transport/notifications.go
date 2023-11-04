package transport

import "github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"

// PacketNofitication notifies of an incoming message
type PacketNotification struct {
	packet abstraction.Packet
}

func NewPacketNotification(packet abstraction.Packet) PacketNotification {
	return PacketNotification{
		packet: packet,
	}
}

// Event always returns PacketEvent
func (notification PacketNotification) Event() abstraction.TransportEvent {
	return PacketEvent
}

// Packet returns the packet associated with the message
func (notification PacketNotification) Packet() abstraction.Packet {
	return notification.packet
}

// Id returns the id of the packet associated with the message
func (notification PacketNotification) Id() abstraction.PacketId {
	return notification.packet.Id()
}
