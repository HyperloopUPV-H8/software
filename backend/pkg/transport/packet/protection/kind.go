package protection

// severity is the level of the protection
type severity string

const (
	SeverityWarning severity = "warning"
	SeverityFault   severity = "fault"
	SeverityError   severity = "error"
)

// kind is the kind of protection
type kind string

// ProtectionData is an interface common to all protection kinds
type ProtectionData interface {
	Kind() kind
}

const (
	OutOfBoundsKind      kind = "OUT_OF_BOUNDS"
	LowerBoundKind       kind = "LOWER_BOUND"
	UpperBoundKind       kind = "UPPER_BOUND"
	EqualsKind           kind = "EQUALS"
	NotEqualsKind        kind = "NOT_EQUALS"
	TimeAccumulationKind kind = "TIME_ACCUMULATION"
	ErrorHandlerKind     kind = "ERROR_HANDLER"
)

// OutOfBounds is a protection thrown when the value gets out of an specific range
type OutOfBounds struct {
	Value  float64    `json:"value"`
	Bounds [2]float64 `json:"bounds"`
}

// Kind returns the protection kind
func (protection *OutOfBounds) Kind() kind {
	return OutOfBoundsKind
}

// UpperBound is a protection thrown when the value exceeds a threshold
type UpperBound struct {
	Value float64 `json:"value"`
	Bound float64 `json:"bound"`
}

// Kind returns the protection kind
func (protection *UpperBound) Kind() kind {
	return UpperBoundKind
}

// LowerBound is a protection thrown when the value goes under a threshold
type LowerBound struct {
	Value float64 `json:"value"`
	Bound float64 `json:"bound"`
}

// Kind returns the protection kind
func (protection *LowerBound) Kind() kind {
	return LowerBoundKind
}

// Equals is a protection thrown when a value is equal to some other value
type Equals struct {
	Value float64 `json:"value"`
}

// Kind returns the protection kind
func (protection *Equals) Kind() kind {
	return EqualsKind
}

// NotEquals is a protection thrown when a value is not equal to a target
type NotEquals struct {
	Value float64 `json:"value"`
	Want  float64 `json:"want"`
}

// Kind returns the protection kind
func (protection *NotEquals) Kind() kind {
	return NotEqualsKind
}

// TimeAccumulation is a protection thrown when the cummulative sum over a period of time exceeds a threshold
type TimeAccumulation struct {
	Value     float64 `json:"value"`
	Bound     float64 `json:"bound"`
	TimeLimit float64 `json:"timelimit"`
}

// Kind returns the protection kind
func (protection *TimeAccumulation) Kind() kind {
	return TimeAccumulationKind
}

// ErrorHandle is a protection thrown by the error handler
type ErrorHandler string

// Kind returns the protection kind
func (protection *ErrorHandler) Kind() kind {
	return ErrorHandlerKind
}
