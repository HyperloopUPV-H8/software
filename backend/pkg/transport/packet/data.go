package packet

import "github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"

// DataDescriptor describes the structure of a data packet as an array of values
type DataDescriptor []ValueDescriptor

// Type assertion to check Data follows the abstraction.Packet interface
var _ abstraction.Packet = &Data{}

// Data is a data packet containing multiple values
type Data struct {
	id     abstraction.PacketId
	values map[ValueName]Value
}

// NewData creates a new data packet
func NewData(id abstraction.PacketId) *Data {
	return &Data{
		id:     id,
		values: make(map[ValueName]Value),
	}
}

// Id returns the id of the data packet
func (data *Data) Id() abstraction.PacketId {
	return data.id
}

// SetValue updates the value with the given name to the new value. It overwrites a value if it is already set
func (data *Data) SetValue(name ValueName, value Value) {
	data.values[name] = value
}

// GetValues returns all values associated with the packet
func (data *Data) GetValues() map[ValueName]Value {
	return data.values
}
