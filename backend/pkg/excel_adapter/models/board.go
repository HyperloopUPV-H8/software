package models

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/excel_adapter/internals/models"
)

const (
	PACKET_TABLE_NAME      = "Packets"
	MEASUREMENT_TABLE_NAME = "Measurements"
	STRUCTURES_TABLE_NAME  = "Structures"
)

type Board struct {
	Name    string
	IP      string
	Packets []Packet
}

func NewBoard(name string, ip string, sheet models.Sheet) Board {

	descriptions := getDescriptions(sheet.Tables[PACKET_TABLE_NAME])
	measurements := getMeasurements(sheet.Tables[MEASUREMENT_TABLE_NAME])
	structures := getStructures(sheet.Tables[STRUCTURES_TABLE_NAME])

	return Board{
		Name:    name,
		IP:      ip,
		Packets: getPackets(descriptions, measurements, structures),
	}
}

func getPackets(descriptions map[string]Description, measurements map[string]Value, structures map[string]Structure) []Packet {
	expandedPackets := make([]Packet, 0)
	for _, description := range descriptions {
		measurements := getPacketMeasurements(description, structures[description.Name], measurements)
		packetDTOs := expandPacket(description, measurements)
		expandedPackets = append(expandedPackets, packetDTOs...)
	}
	return expandedPackets
}

func getPacketMeasurements(description Description, structure Structure, values map[string]Value) []Value {
	wantedMeasurements := structure.Measurements
	measurements := make([]Value, len(wantedMeasurements))
	for index, id := range wantedMeasurements {
		measurements[index] = values[id]
	}

	return measurements
}

func getDescriptions(table models.Table) map[string]Description {
	descriptions := make(map[string]Description, len(table.Rows))
	for _, row := range table.Rows {
		desc := newDescription(row)
		descriptions[desc.Name] = desc
	}

	return descriptions
}

func getMeasurements(table models.Table) map[string]Value {
	measurements := make(map[string]Value, len(table.Rows))
	for _, row := range table.Rows {
		adapter := newValue(row)
		measurements[adapter.ID] = adapter
	}

	return measurements
}

func getStructures(table models.Table) map[string]Structure {
	structures := make(map[string]Structure)
	for _, column := range getColumns(table) {
		structure := newStructure(column)
		structures[structure.PacketName] = structure
	}

	return structures
}

func getColumns(table models.Table) [][]string {
	columns := make([][]string, len(table.Rows[0]))
	for i := 0; i < len(table.Rows[0]); i++ {
		columns[i] = getColumn(i, table)
	}

	return columns
}

func getColumn(i int, table models.Table) []string {
	column := make([]string, len(table.Rows))
	for j := 0; j < len(table.Rows); j++ {
		column[j] = table.Rows[j][i]
	}

	return column
}
