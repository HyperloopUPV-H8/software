package adj

type ADJ struct {
	Info   Info
	Boards map[string]Board
}

type Info struct {
	Ports      map[string]string `json:"ports"`
	Addresses  map[string]string `json:"addresses"`
	Units      map[string]string `json:"units"`
	MessageIds map[string]string `json:"message_ids"`
	BoardIds   map[string]string
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
