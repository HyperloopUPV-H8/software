package models

import "golang.org/x/exp/slices"

type Structure struct {
	PacketName   string
	Measurements []string
}

func newStructure(column []string) Structure {
	var measurements []string

	if endIndex := slices.Index(column, ""); endIndex == -1 {
		measurements = column[1:]
	} else {
		measurements = column[1:endIndex]
	}

	return Structure{
		PacketName:   column[0],
		Measurements: measurements,
	}
}
