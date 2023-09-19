package protection_logger

import (
	"fmt"

	vehicle_models "github.com/HyperloopUPV-H8/h9-backend/internal/vehicle/models"
)

type LoggableProtection vehicle_models.ProtectionMessage

func (lp LoggableProtection) Id() string {
	return lp.Kind
}

func (lp LoggableProtection) Log() []string {
	date := fmt.Sprintf("%d/%d/%d", lp.Timestamp.Day, lp.Timestamp.Month, lp.Timestamp.Year)
	time := fmt.Sprintf("%d:%d:%d", lp.Timestamp.Hour, lp.Timestamp.Minute, lp.Timestamp.Second)
	datetime := fmt.Sprintf("%s %s", date, time)
	data := getDataString(lp.Protection.Data)

	return []string{datetime, lp.Kind, lp.Board, lp.Name, lp.Protection.Kind, data}
}

func getDataString(data any) string {
	switch castedData := data.(type) {
	case vehicle_models.OutOfBounds:
		return fmt.Sprintf("Got: %f Want: %f", castedData.Value, castedData.Bounds)
	case vehicle_models.LowerBound:
		return fmt.Sprintf("Got: %f Want: > %f", castedData.Value, castedData.Bound)
	case vehicle_models.UpperBound:
		return fmt.Sprintf("Got: %f Want: < %f", castedData.Value, castedData.Bound)
	case vehicle_models.Equals:
		return fmt.Sprintf("%f is not allowed", castedData.Value)
	case vehicle_models.NotEquals:
		return fmt.Sprintf("%f should be %f", castedData.Value, castedData.Want)
	case vehicle_models.TimeLimit:
		return fmt.Sprintf("Value (%f) surpassed bound (%f) for %f", castedData.Value, castedData.Bound, castedData.TimeLimit)
	case vehicle_models.Error:
		return fmt.Sprint(castedData)
	default:
		return fmt.Sprintf("UNRECOGNIZED VIOLATION: %v", data)
	}

}
