package protection

type kind string

type Protection interface {
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

type OutOfBounds struct {
	Value  float64    `json:"value"`
	Bounds [2]float64 `json:"bounds"`
}

func (protection *OutOfBounds) Kind() kind {
	return OutOfBoundsKind
}

type UpperBound struct {
	Value float64 `json:"value"`
	Bound float64 `json:"bound"`
}

func (protection *UpperBound) Kind() kind {
	return UpperBoundKind
}

type LowerBound struct {
	Value float64 `json:"value"`
	Bound float64 `json:"bound"`
}

func (protection *LowerBound) Kind() kind {
	return LowerBoundKind
}

type Equals struct {
	Value float64 `json:"value"`
}

func (protection *Equals) Kind() kind {
	return EqualsKind
}

type NotEquals struct {
	Value float64 `json:"value"`
	Want  float64 `json:"want"`
}

func (protection *NotEquals) Kind() kind {
	return NotEqualsKind
}

type TimeAccumulation struct {
	Value     float64 `json:"value"`
	Bound     float64 `json:"bound"`
	TimeLimit float64 `json:"timelimit"`
}

func (protection *TimeAccumulation) Kind() kind {
	return TimeAccumulationKind
}

type ErrorHandler string

func (protection *ErrorHandler) Kind() kind {
	return ErrorHandlerKind
}
