package order_logger

import (
	"fmt"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/data"
)

type LoggableOrder data.Packet

func (lo LoggableOrder) Id() string {
	packet := data.Packet(lo)
	return fmt.Sprint(packet.Id())
}

func (lo LoggableOrder) Log() []string {
	packet := data.Packet(lo)
	return []string{"[GUI]", time.Now().String(), "", "", "", lo.Id(), fmt.Sprint(packet.GetValues())}
}

type LoggableTransmittedOrder data.Packet

func (lto LoggableTransmittedOrder) Id() string {
	packet := data.Packet(lto)
	return fmt.Sprint(packet.Id())
}

func (lto LoggableTransmittedOrder) Log() []string {
	packet := data.Packet(lto)
	return []string{"[TRANSMITTED]", fmt.Sprint(packet.Timestamp()), "--from--", "--to--", "--seq num--", lto.Id(), fmt.Sprint(packet.GetValues())}
}
