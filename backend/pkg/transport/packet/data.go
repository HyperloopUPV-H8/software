package packet

import "github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"

type DataDescriptor []ValueDescriptor

var _ abstraction.Packet = &Data{}

type Data struct {
	id     abstraction.PacketId
	values map[ValueName]Value
}

func NewData(id abstraction.PacketId) *Data {
	return &Data{
		id:     id,
		values: make(map[ValueName]Value),
	}
}

func (data *Data) Id() abstraction.PacketId {
	return data.id
}

func (data *Data) SetValue(name ValueName, value Value) {
	data.values[name] = value
}

func (data *Data) GetValues() map[ValueName]Value {
	return data.values
}
