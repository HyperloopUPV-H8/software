package packet_logger

import (
	"fmt"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type LoggablePacket struct {
	Packet abstraction.Packet
}

func (packet LoggablePacket) Id() string {
	return fmt.Sprint(packet.Packet.Id())
}

func (packet LoggablePacket) Log() []string {
	return []string{
		time.Now().Format(time.RFC3339), // TODO: fetch timestamp
		"--from--",                      // TODO: fetch from
		"--to--",                        // TODO: fetch to
		fmt.Sprint(packet.Id()),
		"--hex--", // TODO: fetch hex vaue
	}
}

func ToLoggablePacket(update abstraction.Packet) LoggablePacket {
	return LoggablePacket{
		Packet: update,
	}
}
