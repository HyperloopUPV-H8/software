package models

import (
	"github.com/HyperloopUPV-H8/h9-backend/internal/packet"
)

type PacketUpdate struct {
	Metadata packet.Metadata
	HexValue []byte
	Values   map[string]packet.Value
}
