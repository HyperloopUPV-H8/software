package ade

type ADE struct {
	Info   Info
	Boards map[string]Board
}

type Info struct {
	Addresses  map[string]string
	Units      map[string]string
	Ports      map[string]string
	BoardIds   map[string]string
	MessageIds map[string]string
}

type Board struct {
	Name         string
	Packets      []Packet
	Measurements []Measurement
	Structures   []Structure
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
