package models

import (
	"github.com/HyperloopUPV-H8/Backend-H8/packet"
)

type PacketUpdate struct {
	Metadata packet.Metadata
	HexValue []byte
	Values   map[string]packet.Value
}
