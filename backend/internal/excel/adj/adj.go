package adj

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

func CreateADJ(file *excelize.File) (ADJ, error) {
	doc, err := document.CreateDocument(file)

	if err != nil {
		return ADJ{}, err
	}
	ADJErrors := common.NewErrorList()

	info, err := getInfo(doc)

	if err != nil {
		ADJErrors.Add(err)
	}

	boardSheets := FilterMap(doc.Sheets, func(name string, _ document.Sheet) bool {
		return strings.HasPrefix(name, BoardPrefix)
	})

	boards, err := getBoards(boardSheets)

	if err != nil {
		ADJErrors.Add(err)
	}

	if len(ADJErrors) > 0 {
		return ADJ{}, ADJErrors
	}

	if err != nil {
		ADJErrors.Add(err)
	}

	if len(ADJErrors) > 0 {
		return ADJ{}, ADJErrors
	}

	return ADJ{
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
