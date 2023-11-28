package info

import (
	"fmt"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet"
)

// infoData is the contents of an info Packet
type infoData string

// Packet is an info packet.
//
// info packets are used to send arbitrary strings for debugging purposes.
type Packet struct {
	id        abstraction.PacketId
	BoardId   abstraction.BoardId `json:"boardId"`
	Timestamp packet.Timestamp    `json:"timestamp"`
	Msg       infoData            `json:"msg"`
}

// NewPacket creates a new info packet with the given ID
func NewPacket(id abstraction.PacketId) *Packet {
	return &Packet{
		id: id,
	}
}

// Id returns the packet id
func (packet *Packet) Id() abstraction.PacketId {
	return packet.id
}

// GetBoardId returns the board id
func (packet *Packet) GetBoardId() string {
	return fmt.Sprint(packet.BoardId)
}

// GetTimestamp returns the timestamp as a packet.Timestamp object
func (packet *Packet) GetTimestamp() packet.Timestamp {
	return packet.Timestamp
}

// ToTime returns the timestamp as a time.Time object
func (packet *Packet) ToTime(timestamp packet.Timestamp) time.Time {
	return time.Date(int(timestamp.Year), time.Month(int(timestamp.Month)), int(timestamp.Day), int(timestamp.Hour), int(timestamp.Minute), int(timestamp.Second), int(timestamp.Counter), time.UTC)
}
