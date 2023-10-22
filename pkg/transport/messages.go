package transport

import (
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

const (
	// PacketEvent is triggered when a packet is sent or received
	PacketEvent abstraction.TransportEvent = "packet"
	// FileWriteEvent is used to request a file write through tftp
	FileWriteEvent abstraction.TransportEvent = "file-push"
	// FileReadEvent is used to request a file read through tftp
	FileReadEvent abstraction.TransportEvent = "file-pull"
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

// Event always returns PacketEvent
func (message PacketMessage) Event() abstraction.TransportEvent {
	return PacketEvent
}

// Packet returns the packet associated with the message
func (message PacketMessage) Packet() abstraction.Packet {
	return message.packet
}

// Id returns the Id of the packet associated with the message
func (message PacketMessage) Id() abstraction.PacketId {
	return message.packet.Id()
}

// FileWriteMessage request a file to be written to a specific target
type FileWriteMessage struct {
	data io.Reader
}

func NewFileWriteMessage(data io.Reader) FileWriteMessage {
	return FileWriteMessage{
		data: data,
	}
}

// Event is always FileWriteEvent
func (message FileWriteMessage) Event() abstraction.TransportEvent {
	return FileWriteEvent
}

// Data returns the data to be written through tftp
func (message FileWriteMessage) Data() io.Reader {
	return message.data
}

// Read maps the message data read method so it can be used directly
func (message FileWriteMessage) Read(p []byte) (n int, err error) {
	return message.data.Read(p)
}

// FileReadMessage request a file to be read from the specific target.
type FileReadMessage struct {
	output io.Writer
}

func NewFileReadMessage(output io.Writer) FileReadMessage {
	return FileReadMessage{
		output: output,
	}
}

// Event always returns FileReadEvent
func (message FileReadMessage) Event() abstraction.TransportEvent {
	return FileReadEvent
}

// Output returns where data read should be written
func (message FileReadMessage) Output() io.Writer {
	return message.output
}

// Write maps the message output write method
func (message FileReadMessage) Write(p []byte) (n int, err error) {
	return message.output.Write(p)
}
