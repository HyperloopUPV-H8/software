package protection_logger

import (
	"fmt"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/protection"
)

type LoggableProtection protection.Packet

func (lp LoggableProtection) Id() string {
	packet := protection.Packet(lp)
	return string(packet.Severity())
}

func (lp LoggableProtection) Log() []string {
	date := fmt.Sprintf("%d/%d/%d", lp.Timestamp.Day, lp.Timestamp.Month, lp.Timestamp.Year)
	time := fmt.Sprintf("%d:%d:%d", lp.Timestamp.Hour, lp.Timestamp.Minute, lp.Timestamp.Second)
	datetime := fmt.Sprintf("%s %s", date, time)
	data := getDataString(lp.Protection.Data)

	packet := protection.Packet(lp)
	return []string{datetime, string(packet.Severity()), fmt.Sprint(lp.BoardId), string(lp.Protection.Name), string(lp.Protection.Type), data}
}

func getDataString(data any) string {
	switch castedData := data.(type) {
	case protection.OutOfBounds:
		return fmt.Sprintf("Got: %f Want: %f", castedData.Value, castedData.Bounds)
	case protection.LowerBound:
		return fmt.Sprintf("Got: %f Want: > %f", castedData.Value, castedData.Bound)
	case protection.UpperBound:
		return fmt.Sprintf("Got: %f Want: < %f", castedData.Value, castedData.Bound)
	case protection.Equals:
		return fmt.Sprintf("%f is not allowed", castedData.Value)
	case protection.NotEquals:
		return fmt.Sprintf("%f should be %f", castedData.Value, castedData.Want)
	case protection.TimeAccumulation:
		return fmt.Sprintf("Value (%f) surpassed bound (%f) for %f", castedData.Value, castedData.Bound, castedData.TimeLimit)
	case protection.ErrorHandler:
		return fmt.Sprint(castedData)
	default:
		return fmt.Sprintf("UNRECOGNIZED VIOLATION: %v", data)
	}

}
