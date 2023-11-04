package models

import (
	"fmt"

	"github.com/HyperloopUPV-H8/h9-backend/internal/excel_adapter/internals"
)

type Packet struct {
	Description Description
	Values      []Value
}

func expandPacket(description Description, measurements []Value) []Packet {
	ids := internals.GetAllIds(description.ID)
	packets := make([]Packet, len(ids))
	for index, id := range ids {
		newPacket := Packet{Description: descriptionWithID(description, id), Values: measurements}
		if len(ids) > 1 {
			sufix := fmt.Sprintf("_%v", index)
			newPacket = packetWithSufix(newPacket, sufix)
		}
		packets[index] = newPacket
	}

	return packets
}

func packetWithSufix(packet Packet, sufix string) Packet {
	return Packet{
		Description: descriptionWithName(packet.Description, packet.Description.Name+sufix),
		Values:      valuesWithSuffix(packet.Values, sufix),
	}
}
