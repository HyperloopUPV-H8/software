package packet_logger

import (
	"fmt"

	"github.com/HyperloopUPV-H8/h9-backend/internal/packet"
	vehicle_models "github.com/HyperloopUPV-H8/h9-backend/internal/vehicle/models"
)

type LoggablePacket struct {
	Metadata packet.Metadata
	HexValue []byte
}

func (packet LoggablePacket) Id() string {
	return fmt.Sprint(packet.Metadata.ID)
}

func (packet LoggablePacket) Log() []string {
	return []string{
		packet.Metadata.Timestamp.String(),
		packet.Metadata.From,
		packet.Metadata.To,
		fmt.Sprintf("%d", packet.Metadata.ID),
		fmt.Sprintf("%X", packet.HexValue),
	}
}

func ToLoggablePacket(update vehicle_models.PacketUpdate) LoggablePacket {
	return LoggablePacket{
		Metadata: update.Metadata,
		HexValue: update.HexValue,
	}
}
