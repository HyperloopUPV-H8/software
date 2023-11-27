package value_logger

import (
	"fmt"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/data"
)

type LoggableValue struct {
	ValueId   string
	Value     data.Packet
	Timestamp time.Time
}

func (value LoggableValue) Id() string {
	return value.ValueId
}

func (value LoggableValue) Log() []string {
	return []string{
		value.Timestamp.String(),
		fmt.Sprintf("%v", value.Value),
	}
}

func ToLoggableValue(id string, value data.Packet, timestamp time.Time) LoggableValue {
	return LoggableValue{
		ValueId:   id,
		Value:     value,
		Timestamp: timestamp,
	}
}
