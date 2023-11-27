package value_logger

import (
	"fmt"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/data"
)

type LoggableValue struct {
	ValueId   string
	Value     data.Value
	Timestamp time.Time
}

func (value LoggableValue) Id() string {
	return value.ValueId
}

type numeric interface {
	Value() float64
}

func (value LoggableValue) Log() []string {
	output := []string{
		value.Timestamp.String(),
	}

	switch v := value.Value.(type) {
	case numeric:
		output = append(output, fmt.Sprint(v.Value()))
	case data.BooleanValue:
		output = append(output, fmt.Sprint(v.Value()))
	case data.EnumValue:
		output = append(output, fmt.Sprint(v.Variant()))
	}

	return output
}

func ToLoggableValue(id string, value data.Value, timestamp time.Time) LoggableValue {
	return LoggableValue{
		ValueId:   id,
		Value:     value,
		Timestamp: timestamp,
	}
}
