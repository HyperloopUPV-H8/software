package models

import "github.com/HyperloopUPV-H8/Backend-H8/packet"

type Order struct {
	ID     uint16           `json:"id"`
	Fields map[string]Field `json:"fields"`
}

type Field struct {
	Value     any  `json:"value"`
	IsEnabled bool `json:"isEnabled"`
}

type TransmittedOrder struct {
	Metadata packet.Metadata
	HexValue []byte
	Values   map[string]packet.Value
}
