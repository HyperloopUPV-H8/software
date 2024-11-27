package document

import (
	"encoding/json"
	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/go-git/go-git/v5"
	"github.com/xuri/excelize/v2"
)

func CreateDocument(file *excelize.File) (Document, error) {
	_, err := git.PlainClone("", false, &git.CloneOptions{
		URL: "https://github.com/HyperloopUPV-H8/JSON_ADE.git",
	})
	if err != nil {
		return Document{}, err
	}

	sheets, err := getFileSheets(file)
	if err != nil {
		return Document{}, err
	}

	rectSheets := getRectSheets(sheets) //TODO remodel into JSON_ADE format

	return Document{
		Sheets: rectSheets,
	}, nil
}

func getFileSheets(file *json.RawMessage) (map[string][][]string, error) {
	fileSheets := make(map[string][][]string)
	sheetMap := file.GetSheetMap()
	sheetsErrs := common.NewErrorList()

	for _, name := range sheetMap {
		sheet, err := file.GetRows(name)

		if err != nil {
			sheetsErrs.Add(err)
			continue
		}

		fileSheets[name] = sheet
	}

	if len(sheetsErrs) > 0 {
		return nil, sheetsErrs
	}

	return fileSheets, nil
}

func getRectSheets(sheets map[string][][]string) map[string][][]string {
	rectSheets := make(map[string][][]string)

	for name, sheet := range sheets {
		rectSheets[name] = makeSheetRect(sheet)
	}

	return rectSheets
}

func makeSheetRect(sheet [][]string) [][]string {
	maxLength := 0

	for _, row := range sheet {
		if len(row) > maxLength {
			maxLength = len(row)
		}
	}

	fullRows := make([][]string, 0)
	for _, row := range sheet {
		fullRow := make([]string, maxLength)
		copy(fullRow, row)
		fullRows = append(fullRows, fullRow)
	}

	return fullRows
}
