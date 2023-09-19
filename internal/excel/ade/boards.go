package ade

import (
	"errors"
	"fmt"
	"strings"

	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	doc "github.com/HyperloopUPV-H8/h9-backend/internal/excel/document"
)

const (
	PacketTable      = "Packets"
	MeasurementTable = "Measurements"
	Structures       = "Structures"
)

var (
	PacketHeaders      = []string{"ID", "Name", "Type"}
	MeasurementHeaders = []string{"ID", "Name", "Type", "PodUnits", "DisplayUnits", "SafeRange", "WarningRange"}
)

func getBoards(sheets map[string]doc.Sheet) (map[string]Board, error) {
	boards := make(map[string]Board)
	boardErrs := common.NewErrorList()
	for name, sheet := range sheets {
		name := strings.TrimPrefix(name, BoardPrefix)
		board, err := getBoard(name, sheet)

		if err != nil {
			boardErrs.Add(err)
		}

		if _, ok := boards[name]; ok {
			boardErrs.Add(errors.New("board already exists"))
			continue
		}

		boards[name] = board
	}

	if len(boardErrs) > 0 {
		return nil, boardErrs
	}

	return boards, nil
}

func getBoard(name string, sheet doc.Sheet) (Board, error) {
	boardErrs := common.NewErrorList()
	packets, err := getPackets(sheet)

	if err != nil {
		boardErrs.Add(err)
	}

	err = checkDuplicateIds(common.Map(packets, func(packet Packet) string {
		return packet.Id
	}))

	if err != nil {
		boardErrs.Add(err)
	}

	measurements, err := getMeasurements(sheet)

	if err != nil {
		boardErrs.Add(err)
	}

	err = checkDuplicateIds(common.Map(measurements, func(meas Measurement) string {
		return meas.Id
	}))

	if err != nil {
		boardErrs.Add(err)
	}

	structures, err := getStructures(sheet)

	if err != nil {
		boardErrs.Add(err)
	}

	err = checkDuplicateIds(common.Map(structures, func(structure Structure) string {
		return structure.Packet
	}))

	if err != nil {
		boardErrs.Add(err)
	}

	if len(boardErrs) > 0 {
		return Board{}, boardErrs
	}

	return Board{
		Name:         name,
		Packets:      packets,
		Measurements: measurements,
		Structures:   structures,
	}, nil
}

func getPackets(sheet doc.Sheet) ([]Packet, error) {
	packetTable, err := getTable(PacketTable, sheet, PacketHeaders)

	if err != nil {
		return make([]Packet, 0), err
	}

	packets := make([]Packet, 0)

	for _, row := range packetTable {
		packets = append(packets, Packet{
			Id:   row[0],
			Name: row[1],
			Type: row[2],
		})
	}

	return packets, nil
}

func getMeasurements(sheet doc.Sheet) ([]Measurement, error) {
	measurementTable, err := getTable(MeasurementTable, sheet, MeasurementHeaders)

	if err != nil {
		return make([]Measurement, 0), err
	}

	measurements := make([]Measurement, 0)

	for _, row := range measurementTable {
		measurements = append(measurements, Measurement{
			Id:           row[0],
			Name:         row[1],
			Type:         row[2],
			PodUnits:     row[3],
			DisplayUnits: row[4],
			SafeRange:    row[5],
			WarningRange: row[6],
		})
	}

	return measurements, nil
}

func getStructures(sheet doc.Sheet) ([]Structure, error) {
	structuresTable, err := findTableAutoSize(sheet, Structures)

	if err != nil {
		return make([]Structure, 0), err
	}

	structuresTable = getStructureColumns(structuresTable)

	structures := make([]Structure, 0)

	for _, col := range structuresTable {
		if len(col) == 1 {
			structures = append(structures, Structure{
				Packet:       col[0],
				Measurements: make([]string, 0),
			})
		} else {
			structures = append(structures, Structure{
				Packet:       col[0],
				Measurements: col[1:],
			})
		}
	}

	return structures, nil
}

func checkDuplicateIds(ids []string) error {
	idSet := common.NewSet[string]()
	for _, id := range ids {
		if idSet.Has(id) {
			return fmt.Errorf("duplicate id %s", id)
		} else {
			idSet.Add(id)
		}
	}

	return nil
}

func getTable(name string, sheet doc.Sheet, headers []string) (Table, error) {
	table, ok := findTable(sheet, name, len(headers))

	if !ok {
		return Table{}, fmt.Errorf("table %s not found", name)
	}

	if len(table) == 0 {
		return Table{}, fmt.Errorf("table %s is empty (not even headers)", name)
	}

	if len(table) == 1 {
		return table, nil
	} else {
		return table[1:], nil
	}
}

func getStructureColumns(rows [][]string) [][]string {
	structures := rows[1:]
	structures = toColumns(structures)

	croppedStructures := make([][]string, 0)
outer:
	for _, column := range structures {
		for j, cell := range column {
			if cell == "" {
				croppedStructures = append(croppedStructures, column[:j])
				continue outer
			}
		}
		croppedStructures = append(croppedStructures, column)
	}

	return croppedStructures
}

func toColumns(rows [][]string) [][]string {
	if len(rows) == 0 {
		return rows
	}

	columns := make([][]string, 0)
	for i := 0; i < len(rows[0]); i++ {
		columns = append(columns, toColumn(rows, i))
	}

	return columns
}

func toColumn(rows [][]string, col int) []string {
	if len(rows) == 0 {
		return make([]string, 0)
	}

	column := make([]string, 0)

	for i := 0; i < len(rows); i++ {
		column = append(column, rows[i][col])
	}

	return column
}
