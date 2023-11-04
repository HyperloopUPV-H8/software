package order_logger

import (
	"fmt"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/internal/vehicle/models"
)

type LoggableOrder models.Order

func (lo LoggableOrder) Id() string {
	return fmt.Sprint(lo.ID)
}

func (lo LoggableOrder) Log() []string {
	return []string{"[GUI]", time.Now().String(), "", "", "", fmt.Sprint(lo.ID), fmt.Sprint(lo.Fields)}
}

type LoggableTransmittedOrder models.PacketUpdate

func (lto LoggableTransmittedOrder) Id() string {
	return fmt.Sprint(lto.Metadata.ID)
}

func (lto LoggableTransmittedOrder) Log() []string {

	return []string{"[TRANSMITTED]", fmt.Sprint(lto.Metadata.Timestamp), fmt.Sprint(lto.Metadata.From), fmt.Sprint(lto.Metadata.To), fmt.Sprint(lto.Metadata.SeqNum), fmt.Sprint(lto.Metadata.ID), fmt.Sprint(lto.Values)}
}
