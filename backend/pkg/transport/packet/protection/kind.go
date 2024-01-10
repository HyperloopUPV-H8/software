// # Protection Kinds
// Protections have a kind, which is used to identify what triggered the protection.
// Each kind defines the data carried along with the protection and can be found here:
//
//   - [Below]
//   - [Above]
//   - [OutOfBounds]
//   - [Equals]
//   - [NotEquals]
//   - [ErrorHandler]
//   - [TimeAccumulation]
package protection

// Below is a protection that triggers when the data goes below a threshold.
type Below[T valueType] struct {
	Threshold T
	Value     T
}

func (Below[T]) Kind() Kind {
	return BelowKind
}

// Above is a protection that triggers when the data goes above a threshold.
type Above[T valueType] struct {
	Threshold T
	Value     T
}

func (Above[T]) Kind() Kind {
	return AboveKind
}

// OutOfBounds is a protection that triggers when the data goes out of a range.
type OutOfBounds[T valueType] struct {
	LowerBound T
	UpperBound T
	Value      T
}

func (OutOfBounds[T]) Kind() Kind {
	return OutOfBoundsKind
}

// Equals is a protection that triggers when the data is equal to a value.
type Equals[T valueType] struct {
	Target T
	Value  T
}

func (Equals[T]) Kind() Kind {
	return EqualsKind
}

// NotEquals is a protection that triggers when the data is not equal to a value.
type NotEquals[T valueType] struct {
	Target T
	Value  T
}

func (NotEquals[T]) Kind() Kind {
	return NotEqualsKind
}

// ErrorHandler is a protection that triggers when an error occurs.
type ErrorHandler struct {
	Error string
}

func (ErrorHandler) Kind() Kind {
	return ErrorHandlerKind
}

// TimeAccumulation is a protection that triggers when the data over a period of time is too big.
//
// The time is specified in seconds and the frequency of measurements is specified in Hz.
type TimeAccumulation[T valueType] struct {
	Threshold T
	Value     T
	Time      float32
	Frequency float32
}

func (TimeAccumulation[T]) Kind() Kind {
	return TimeAccumulationKind
}
