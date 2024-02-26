package sniffer

import (
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network"
)

type Payload struct {
	CaptureTime time.Time
	Socket      network.Socket
	Data        []byte
}
