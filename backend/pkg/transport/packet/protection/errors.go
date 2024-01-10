package protection

import (
	"fmt"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

// ErrUnknownBound is returned when the protection kind is not defined
type ErrUnknownBound struct {
	Bound Bound
}

func (err ErrUnknownBound) Error() string {
	var bound string
	switch err.Bound {
	case BelowBound:
		bound = "below"
	case AboveBound:
		bound = "above"
	case OutOfBoundsBound:
		bound = "out of bounds"
	case EqualsBound:
		bound = "equals"
	case NotEqualsBound:
		bound = "not equals"
	case ErrorHandlerBound:
		bound = "error handler"
	case TimeAccumulationBound:
		bound = "time accumulation"
	default:
		bound = fmt.Sprint(err.Bound)
	}
	return fmt.Sprintf("unrecognized kind %s", bound)
}

// ErrUnknownSeverity is returned when the severity of the protection is unknown
type ErrUnknownSeverity struct {
	Id abstraction.PacketId
}

func (err ErrUnknownSeverity) Error() string {
	return fmt.Sprintf("unknown severity for id %d", err.Id)
}
