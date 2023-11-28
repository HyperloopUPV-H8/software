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

// GetTimestamp returns the timestamp as a time.Time object
func (packet *Packet) GetTimestamp() time.Time {
	t := packet.Timestamp
	return time.Date(int(t.Year), time.Month(int(t.Month)), int(t.Day), int(t.Hour), int(t.Minute), int(t.Second), int(t.Counter), time.UTC)
}
