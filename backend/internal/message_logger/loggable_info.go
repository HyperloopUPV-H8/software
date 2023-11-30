package protection_logger

import (
	"fmt"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/info"
)

type LoggableInfo info.Packet

func (info LoggableInfo) Id() string {
	return "info"
}

func (info LoggableInfo) Log() []string {
	date := fmt.Sprintf("%d/%d/%d", info.Timestamp.Day, info.Timestamp.Month, info.Timestamp.Year)
	time := fmt.Sprintf("%d:%d:%d", info.Timestamp.Hour, info.Timestamp.Minute, info.Timestamp.Second)
	datetime := fmt.Sprintf("%s %s", date, time)
	return []string{datetime, "info", fmt.Sprint(info.BoardId), string(info.Msg)}
}
