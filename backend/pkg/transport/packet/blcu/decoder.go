package blcu

import (
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type Decoder struct{}

func (decoder *Decoder) Decode(id abstraction.PacketId, reader io.Reader) (abstraction.Packet, error) {
	return &Ack{id: id}, nil
}
