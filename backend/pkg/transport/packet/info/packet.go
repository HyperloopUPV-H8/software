package info

import (
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	transport_packet "github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet"
)

// infoData is the contents of an info Packet
type infoData string

// Packet is an info packet.
//
// info packets are used to send arbitrary strings for debugging purposes.
type Packet struct {
	id        abstraction.PacketId
	BoardId   abstraction.BoardId        `json:"boardId"`
	Timestamp transport_packet.Timestamp `json:"timestamp"`
	Msg       infoData                   `json:"msg"`
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
func (packet *Packet) GetBoardId() abstraction.BoardId {
	return packet.BoardId
}

// GetTimestamp returns the timestamp as a packet.Timestamp object
func (packet *Packet) GetTimestamp() transport_packet.Timestamp {
	return packet.Timestamp
}

// ToTime returns the timestamp as a time.Time object
func (packet *Packet) ToTime(timestamp transport_packet.Timestamp) time.Time {
	return time.Date(int(timestamp.Year), time.Month(int(timestamp.Month)), int(timestamp.Day), int(timestamp.Hour), int(timestamp.Minute), int(timestamp.Second), int(timestamp.Counter), time.UTC)
}
