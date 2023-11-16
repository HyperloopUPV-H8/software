package data

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

// Type assertion to check Data follows the abstraction.Packet interface
var _ abstraction.Packet = &Packet{}

// Packet is a data packet containing multiple values
type Packet struct {
	id     abstraction.PacketId
	values map[ValueName]Value
}

// NewPacket creates a new data packet
func NewPacket(id abstraction.PacketId) *Packet {
	return &Packet{
		id:     id,
		values: make(map[ValueName]Value),
	}
}

// Id returns the id of the data packet
func (packet *Packet) Id() abstraction.PacketId {
	return packet.id
}

// SetValue updates the value with the given name to the new value. It overwrites a value if it is already set
func (packet *Packet) SetValue(name ValueName, value Value) {
	packet.values[name] = value
}

// GetValues returns all values associated with the packet
func (packet *Packet) GetValues() map[ValueName]Value {
	return packet.values
}
