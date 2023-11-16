package info

import (
	"encoding/json"
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type Decoder struct{}

func (decoder *Decoder) Decode(id abstraction.PacketId, reader io.Reader) (abstraction.Packet, error) {
	packet := Packet{
		id: id,
	}

	jsonDecoder := json.NewDecoder(reader)
	err := jsonDecoder.Decode(&packet)
	return &packet, err
}
