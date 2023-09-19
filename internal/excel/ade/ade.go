package ade

import (
	"strings"

	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/HyperloopUPV-H8/h9-backend/internal/excel/document"
	"github.com/xuri/excelize/v2"
)

const (
	InfoName    = "GLOBAL INFO" //TODO: change to INFO
	BoardPrefix = "BOARD "
)

func CreateADE(file *excelize.File) (ADE, error) {
	doc, err := document.CreateDocument(file)

	if err != nil {
		return ADE{}, err
	}
	adeErrors := common.NewErrorList()

	info, err := getInfo(doc)

	if err != nil {
		adeErrors.Add(err)
	}

	boardSheets := FilterMap(doc.Sheets, func(name string, _ document.Sheet) bool {
		return strings.HasPrefix(name, BoardPrefix)
	})

	boards, err := getBoards(boardSheets)

	if err != nil {
		adeErrors.Add(err)
	}

	if len(adeErrors) > 0 {
		return ADE{}, adeErrors
	}

	if err != nil {
		adeErrors.Add(err)
	}

	if len(adeErrors) > 0 {
		return ADE{}, adeErrors
	}

	return ADE{
		Info:   info,
		Boards: boards,
	}, nil
}

func FilterMap[K comparable, V any](myMap map[K]V, predicate func(key K, value V) bool) map[K]V {
	filteredMap := make(map[K]V)

	for key, value := range myMap {
		if predicate(key, value) {
			filteredMap[key] = value
		}
	}

	return filteredMap
}
