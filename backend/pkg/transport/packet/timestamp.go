package packet

import (
	"time"
)

// Timestamp is a timestamp generated and sent by the boards
type Timestamp struct {
	Counter uint16 `json:"counter"`
	Second  uint8  `json:"second"`
	Minute  uint8  `json:"minute"`
	Hour    uint8  `json:"hour"`
	Day     uint8  `json:"day"`
	Month   uint8  `json:"month"`
	Year    uint16 `json:"year"`
}

// ToTime returns the timestamp as a time.Time object
func (timestamp *Timestamp) ToTime() time.Time {
	return time.Date(int(timestamp.Year), time.Month(int(timestamp.Month)), int(timestamp.Day), int(timestamp.Hour), int(timestamp.Minute), int(timestamp.Second), int(timestamp.Counter), time.UTC)
}
