package ade

import (
	"errors"
	"fmt"

	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	doc "github.com/HyperloopUPV-H8/h9-backend/internal/excel/document"
)

const (
	Addresses  = "addresses"
	Units      = "units"
	Ports      = "ports"
	BoardIds   = "board_ids"
	MessageIds = "message_ids"
	BackendKey = "Backend"
)

func getInfo(doc doc.Document) (Info, error) {
	infoSheet, ok := doc.Sheets[InfoName]

	if !ok {
		return Info{}, common.NewStackError(errors.New("InfoSheet not found"))
	}

	tableErrors := common.NewErrorList()
	tables, err := getTables(infoSheet)

	if err != nil {
		tableErrors.Add(err)
	}

	addresses, err := getTableMap(tables, Addresses)

	if err != nil {
		tableErrors.Add(err)
	}

	units, err := getTableMap(tables, Units)

	if err != nil {
		tableErrors.Add(err)
	}

	ports, err := getTableMap(tables, Ports)

	if err != nil {
		tableErrors.Add(err)
	}

	boardIds, err := getTableMap(tables, BoardIds)

	if err != nil {
		tableErrors.Add(err)
	}

	messageIds, err := getTableMap(tables, MessageIds)
	if err != nil {
		tableErrors.Add(err)
	}

	if len(tableErrors) > 0 {
		return Info{}, tableErrors
	}

	return Info{
		Addresses:  addresses,
		Units:      units,
		Ports:      ports,
		BoardIds:   boardIds,
		MessageIds: messageIds,
	}, nil
}

func removeHeaders(table Table) Table {
	if len(table) == 0 {
		return table
	}

	return table[1:]
}

func getTableMap(tables map[string][][]string, id string) (map[string]string, error) {
	table, ok := tables[id]

	if !ok {
		return map[string]string{}, fmt.Errorf("getting %s table", id)
	}

	table = removeHeaders(table)

	return tableToMap(table), nil
}

func tableToMap(table [][]string) map[string]string {
	m := make(map[string]string, len(table))

	for _, row := range table {
		m[row[0]] = row[1]
	}

	return m
}
