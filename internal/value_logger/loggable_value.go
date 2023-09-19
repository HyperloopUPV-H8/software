package value_logger

import (
	"fmt"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/internal/packet"
)

type LoggableValue struct {
	ValueId   string
	Value     packet.Value
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

func ToLoggableValue(id string, value packet.Value, timestamp time.Time) LoggableValue {
	return LoggableValue{
		ValueId:   id,
		Value:     value,
		Timestamp: timestamp,
	}
}
