package presentation

import (
	"bytes"
	"encoding/binary"
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type PacketEncoder interface {
	Encode(abstraction.Packet, io.Writer) error
}

type Encoder struct {
	idToEncoder map[abstraction.PacketId]PacketEncoder
	endianness  binary.ByteOrder
}

// TODO: improve constructor
// NewEncoder creates a new encoder with the given endianness
func NewEncoder(endianness binary.ByteOrder) *Encoder {
	return &Encoder{
		idToEncoder: make(map[abstraction.PacketId]PacketEncoder),
		endianness:  endianness,
	}
}

// SetPacketEncoder sets the encoder for the specified id
func (encoder *Encoder) SetPacketEncoder(id abstraction.PacketId, enc PacketEncoder) {
	encoder.idToEncoder[id] = enc
}

// Encode encodes the provided packet into a byte slice, returning any errors
func (encoder *Encoder) Encode(packet abstraction.Packet) ([]byte, error) {
	enc, ok := encoder.idToEncoder[packet.Id()]
	if !ok {
		return nil, ErrUnexpectedId{Id: packet.Id()}
	}

	buffer := new(bytes.Buffer)

	err := binary.Write(buffer, encoder.endianness, packet.Id())
	if err != nil {
		return buffer.Bytes(), err
	}

	err = enc.Encode(packet, buffer)
	return buffer.Bytes(), err
}
