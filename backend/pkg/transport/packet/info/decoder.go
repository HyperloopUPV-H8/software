package info

import (
	"encoding/json"
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

// Decoder is a decoder for info packets. It uses json to decode the information
type Decoder struct{}

// NewDecoder creates a new Decoder
func NewDecoder() *Decoder {
	return &Decoder{}
}

// Decode decodes the next packet from the provided reader
func (decoder *Decoder) Decode(id abstraction.PacketId, reader io.Reader) (abstraction.Packet, error) {
	packet := Packet{
		id: id,
	}

	jsonDecoder := json.NewDecoder(reader)
	err := jsonDecoder.Decode(&packet)
	return &packet, err
}
