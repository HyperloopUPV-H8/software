package message_parser

import (
	"encoding/json"

	"github.com/HyperloopUPV-H8/h9-backend/internal/vehicle/models"
)

type InfoMessageAdapter struct {
	BoardId   uint16           `json:"boardId"`
	Timestamp models.Timestamp `json:"timestamp"`
	Msg       string           `json:"msg"`
}

type ProtectionMessageAdapter struct {
	BoardId    uint16            `json:"boardId"`
	Timestamp  models.Timestamp  `json:"timestamp"`
	Protection ProtectionAdapter `json:"protection"`
}

type ProtectionAdapter struct {
	Name string           `json:"name"`
	Type string           `json:"type"`
	Data *json.RawMessage `json:"data"`
}

type StateOrdersAdapter struct {
	Action      string
	StateOrders models.StateOrdersMessage
}
