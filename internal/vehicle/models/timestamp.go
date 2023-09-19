package models

type Timestamp struct {
	Counter uint16 `json:"counter"`
	Second  uint8  `json:"second"`
	Minute  uint8  `json:"minute"`
	Hour    uint8  `json:"hour"`
	Day     uint8  `json:"day"`
	Month   uint8  `json:"month"`
	Year    uint16 `json:"year"`
}
