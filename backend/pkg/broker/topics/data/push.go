package data

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/data"
)

type Push struct {
	packet *data.Packet
}

func NewPush(packet *data.Packet) *Push {
	return &Push{packet}
}

func (push *Push) Topic() abstraction.BrokerTopic {
	return UpdateName
}

func (push *Push) Packet() *data.Packet {
	return push.packet
}

func (push *Push) ToPayload() *Payload {
	payload := Payload{
		Id:        push.packet.Id(),
		HexValue:  "", // TODO: get HexValue
		Count:     0,  // TODO: get count
		CycleTime: 0,  // TODO: get cycle time
		Values:    make(map[data.ValueName]Value),
	}

	for name, measurement := range push.packet.GetValues() {
		switch value := measurement.(type) {
		case numericValue:
			payload.Values[name] = &NumericValue{
				Last:    value.Value(),
				Average: value.Value(),
			}
		case booleanValue:
			v := BooleanValue(value.Value())
			payload.Values[name] = &v
		case enumValue:
			v := EnumValue(value.Value())
			payload.Values[name] = &v
		}
	}

	return &payload
}

type numericValue interface {
	Value() float64
}

type booleanValue interface {
	Value() bool
}

type enumValue interface {
	Value() string
}

type Payload struct {
	Id        abstraction.PacketId     `json:"id"`
	HexValue  string                   `json:"hexValue"`
	Count     uint64                   `json:"count"`
	CycleTime uint64                   `json:"cycleTime"`
	Values    map[data.ValueName]Value `json:"measurementUpdates"`
}

type Value interface {
	Kind() string
}

type NumericValue struct {
	Last    float64 `json:"last"`
	Average float64 `json:"average"`
}

func (value NumericValue) Kind() string {
	return "numeric"
}

type BooleanValue bool

func (value BooleanValue) Kind() string {
	return "boolean"
}

type EnumValue string

func (value EnumValue) Kind() string {
	return "enum"
}
