package info

import (
	"encoding/json"
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type delimiter = byte

// Decoder is a decoder for info packets. It uses json to decode the information
type Decoder struct {
	packetDelimiter delimiter
}

// NewDecoder creates a new Decoder
func NewDecoder(delimiter delimiter) *Decoder {
	return &Decoder{
		packetDelimiter: delimiter,
	}
}

// Decode decodes the next packet from the provided reader
func (decoder *Decoder) Decode(id abstraction.PacketId, reader io.Reader) (abstraction.Packet, error) {
	packet := NewPacket(id)

	// Read exactly up to the delimiter
	packetBuf := make([]byte, 0)
	readbuf := make([]byte, 1)
	var readErr error
	var n int
	for {
		n, readErr = reader.Read(readbuf)
		if n < 1 || readbuf[0] == decoder.packetDelimiter {
			break
		}
		packetBuf = append(packetBuf, readbuf[0])
	}

	err := json.Unmarshal(packetBuf, &packet)
	if err != nil {
		return packet, err
	}
	return packet, readErr
}
