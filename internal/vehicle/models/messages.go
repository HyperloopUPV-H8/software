package models

type StateOrdersMessage struct {
	BoardId string   `json:"board"`
	Orders  []uint16 `json:"orders"`
}

type InfoMessage struct {
	Board     string    `json:"board"`
	Timestamp Timestamp `json:"timestamp"`
	Msg       string    `json:"msg"`
	Kind      string    `json:"kind"`
}

type ProtectionMessage struct {
	Board     string    `json:"board"`
	Name      string    `json:"name"`
	Timestamp Timestamp `json:"timestamp"`

	Kind       string     `json:"kind"`
	Protection Protection `json:"protection"`
}

type Protection struct {
	Kind string `json:"kind"`
	Data any    `json:"data"`
}

type OutOfBounds struct {
	Value  float64    `json:"value"`
	Bounds [2]float64 `json:"bounds"`
}
type LowerBound struct {
	Value float64 `json:"value"`
	Bound float64 `json:"bound"`
}
type UpperBound struct {
	Value float64 `json:"value"`
	Bound float64 `json:"bound"`
}
type Equals struct {
	Value float64 `json:"value"`
}
type NotEquals struct {
	Value float64 `json:"value"`
	Want  float64 `json:"want"`
}

type Error = string

type Info = string
