package transport

import (
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

const (
	PacketEvent    abstraction.TransportEvent = "packet"
	FileWriteEvent abstraction.TransportEvent = "file-push"
	FileReadEvent  abstraction.TransportEvent = "file-pull"
)

// PacketMessage request a packet to be sent to the vehicle.
type PacketMessage struct {
	packet abstraction.Packet
}

func NewPacketMessage(packet abstraction.Packet) PacketMessage {
	return PacketMessage{
		packet: packet,
	}
}

func (message PacketMessage) Event() abstraction.TransportEvent {
	return PacketEvent
}

func (message PacketMessage) Packet() abstraction.Packet {
	return message.packet
}

func (message PacketMessage) Id() abstraction.PacketId {
	return message.packet.Id()
}

// FileWriteMessage request a file to be written to a specific target
type FileWriteMessage struct {
	data   io.Reader
	target abstraction.TransportTarget
}

func NewFileWriteMessage(data io.Reader, target abstraction.TransportTarget) FileWriteMessage {
	return FileWriteMessage{
		data:   data,
		target: target,
	}
}

func (message FileWriteMessage) Event() abstraction.TransportEvent {
	return FileWriteEvent
}

func (message FileWriteMessage) Data() io.Reader {
	return message.data
}

func (message FileWriteMessage) Read(p []byte) (n int, err error) {
	return message.data.Read(p)
}

func (message FileWriteMessage) Target() abstraction.TransportTarget {
	return message.target
}

// FileReadMessage request a file to be read from the specific target.
type FileReadMessage struct {
	output io.Writer
	target abstraction.TransportTarget
}

func NewFileReadMessage(output io.Writer, target abstraction.Transport) FileReadMessage {
	return FileReadMessage{
		output: output,
	}
}

func (message FileReadMessage) Event() abstraction.TransportEvent {
	return FileReadEvent
}

func (message FileReadMessage) Output() io.Writer {
	return message.output
}

func (message FileReadMessage) Write(p []byte) (n int, err error) {
	return message.output.Write(p)
}

func (message FileReadMessage) Target() abstraction.TransportTarget {
	return message.target
}
