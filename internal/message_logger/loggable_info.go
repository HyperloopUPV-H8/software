package protection_logger

import (
	"fmt"

	vehicle_models "github.com/HyperloopUPV-H8/h9-backend/internal/vehicle/models"
)

type LoggableInfo vehicle_models.InfoMessage

func (info LoggableInfo) Id() string {
	return "info"
}

func (info LoggableInfo) Log() []string {
	date := fmt.Sprintf("%d/%d/%d", info.Timestamp.Day, info.Timestamp.Month, info.Timestamp.Year)
	time := fmt.Sprintf("%d:%d:%d", info.Timestamp.Hour, info.Timestamp.Minute, info.Timestamp.Second)
	datetime := fmt.Sprintf("%s %s", date, time)
	return []string{datetime, "info", info.Board, info.Msg}
}
