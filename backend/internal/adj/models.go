package adj

import "github.com/HyperloopUPV-H8/h9-backend/internal/utils"

type ADJ struct {
	Info   Info
	Boards map[string]Board
}

type InfoJSON struct {
	Ports      map[string]uint16 `json:"ports"`
	Addresses  map[string]string
	Units      map[string]string `json:"units"`
	MessageIds map[string]uint16 `json:"message_ids"`
	BoardIds   map[string]uint16
}

type Info struct {
	Ports      map[string]uint16
	Addresses  map[string]string
	Units      map[string]utils.Operations
	MessageIds map[string]uint16
	BoardIds   map[string]uint16
}

type BoardJSON struct {
	ID                uint16   `json:"board_id"`
	IP                string   `json:"board_ip"`
	MeasurementsPaths []string `json:"measurements"`
	PacketsPaths      []string `json:"packets"`
}

type Board struct {
	Name         string
	IP           string
	Packets      []Packet
	Measurements []Measurement
	Structures   []Structure
}

type Packet struct {
	Id   string `json:"id"`
	Name string `json:"name"`
	Type string `json:"type"`
}

type Measurement struct {
	Id           string     `json:"id"`
	Name         string     `json:"name"`
	Type         string     `json:"type"`
	PodUnits     string     `json:"podUnits"`
	DisplayUnits string     `json:"displayUnits"`
	SafeRange    []*float64 `json:"safeRange"`
	WarningRange []*float64 `json:"warningRange"`
	EnumValues   []string   `json:"enumValues"`
}

type Structure struct {
	Packet       Packet
	Measurements []Measurement
}
