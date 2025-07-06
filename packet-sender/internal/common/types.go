package common

import (
	"math/rand"
	"time"
)

type Timestamp struct {
	Counter uint16
	Second  uint8
	Minute  uint8
	Hour    uint8
	Day     uint8
	Month   uint8
	Year    uint16
}

func NewTimestamp() Timestamp {
	now := time.Now()
	return Timestamp{
		Counter: uint16(rand.Intn(65536)),
		Second:  uint8(now.Second()),
		Minute:  uint8(now.Minute()),
		Hour:    uint8(now.Hour()),
		Day:     uint8(now.Day()),
		Month:   uint8(now.Month()),
		Year:    uint16(now.Year()),
	}
}