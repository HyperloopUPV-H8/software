package adj

import "github.com/HyperloopUPV-H8/h9-backend/internal/utils"

type ADJ struct {
	Info   Info
	Boards map[string]Board
}

type Info struct {
	Ports      map[string]uint16           `json:"ports"`
	Addresses  map[string]string           `json:"addresses"`
	Units      map[string]utils.Operations `json:"units"`
	MessageIds map[string]uint16           `json:"message_ids"`
	BoardIds   map[string]uint16
}

type Board struct {
	Name         string
	IP           string
	Packets      []Packet
	Measurements []Measurement
	Structures   []Structure
}

type BoardJSON struct {
	ID                uint16   `json:"board_id"`
	IP                string   `json:"board_ip"`
	MeasurementsPaths []string `json:"measurements"`
	PacketsPaths      []string `json:"packets"`
	// StructuresPaths   []string `json:"structures"` // TODO: Issued in JSON_ADE #1
}

type Packet struct {
	Id   string
	Name string
	Type string
}

type Measurement struct {
	Id           string
	Name         string
	Type         string
	PodUnits     string
	DisplayUnits string
	SafeRange    string
	WarningRange string
}

type Structure struct {
	Packet       string
	Measurements []string
}