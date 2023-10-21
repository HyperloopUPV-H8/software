package transport

import "github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"

type PacketNotification struct {
	packet abstraction.Packet
}

func NewPacketNotification(packet abstraction.Packet) PacketNotification {
	return PacketNotification{
		packet: packet,
	}
}

func (notification PacketNotification) Event() abstraction.TransportEvent {
	return "packet"
}

func (notification PacketNotification) Packet() abstraction.Packet {
	return notification.packet
}

func (notification PacketNotification) Id() abstraction.PacketId {
	return notification.packet.Id()
}
