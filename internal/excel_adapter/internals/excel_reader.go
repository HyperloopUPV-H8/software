package internals

import (
	"log"
	"strings"

	"github.com/HyperloopUPV-H8/h9-backend/internal/excel_adapter/internals/models"
	"github.com/xuri/excelize/v2"
)

type ParseConfig struct {
	GlobalSheetPrefix string            `toml:"global_sheet_prefix"`
	BoardSheetPrefix  string            `toml:"board_sheet_prefix"`
	TablePrefix       string            `toml:"table_prefix"`
	Global            GlobalParseConfig `toml:"global"`
}

type GlobalParseConfig struct {
	AddressTable    string `toml:"address_table"`
	BackendKey      string `toml:"backend_key"`
	BLCUAddressKey  string `toml:"blcu_address_key"`
	UnitsTable      string `toml:"units_table"`
	PortsTable      string `toml:"ports_table"`
	BoardIdsTable   string `toml:"board_ids_table"`
	MessageIdsTable string `toml:"message_ids_table"`
}

func GetDocument(file *excelize.File, config ParseConfig) models.Document {
	infoSheet, boardSheets := parseSheets(file, config)
	document := models.Document{
		Info:        infoSheet,
		BoardSheets: boardSheets,
	}
	return document
}

func parseSheets(file *excelize.File, config ParseConfig) (models.Sheet, map[string]models.Sheet) {
	infoSheet := models.Sheet{}
	boardSheets := make(map[string]models.Sheet)
	sheetMap := file.GetSheetMap()
	for _, name := range sheetMap {
		cols := getSheetCols(file, name)
		if strings.HasPrefix(name, config.GlobalSheetPrefix) {
			infoSheet = parseSheet(name, cols, config.TablePrefix)

		} else if strings.HasPrefix(name, config.BoardSheetPrefix) {
			boardSheets[strings.TrimPrefix(name, config.BoardSheetPrefix)] = parseSheet(name, cols, config.TablePrefix)
		}
	}

	return infoSheet, boardSheets
}

func getSheetCols(file *excelize.File, sheetName string) [][]string {
	cols, err := file.GetCols(sheetName)
	if err != nil {
		log.Fatalf("error gettings columns: %s\n", err)
	}
	return cols
}

func parseSheet(name string, cols [][]string, tablePrefix string) models.Sheet {
	tables := make(map[string]models.Table)

	for name, bound := range findTables(cols, tablePrefix) {
		tables[name] = parseTable(cols, bound)
	}

	return models.Sheet{
		Tables: tables,
	}
}

func findTables(cols [][]string, tablePrefix string) map[string][4]int {
	tables := make(map[string][4]int)
	for i, col := range cols {
		for j, cell := range col {
			if strings.HasPrefix(cell, tablePrefix) {
				end := findTableEnd(cols, i, j)
				tables[strings.TrimPrefix(cell, tablePrefix)] = [4]int{i, j, i + end[0], j + end[1] + 2}
			}
		}
	}
	return tables
}

func findTableEnd(cols [][]string, firstCol int, firstRow int) (bound [2]int) {
	width := findTableWidth(cols, firstCol, firstRow)
	bound[0] = width

	height := findTableHeight(cols, firstCol, firstRow, width)
	bound[1] = height
	return
}

func findTableWidth(cols [][]string, firstCol int, firstRow int) int {
	for i, col := range cols[firstCol:] {
		if col[firstRow+1] == "" {
			return i
		} else if i == len(cols[firstCol:])-1 {
			return i + 1
		}
	}
	return -1
}

func findTableHeight(cols [][]string, firstCol int, firstRow int, width int) int {
	maxHeight := 0
	height := 0
	for _, col := range cols[firstCol : width+firstCol] {
		for j, cell := range col[firstRow+2:] { //firstRox+2: first data row
			if cell == "" {
				height = j
				break
			} else if j == len(col[firstRow+2:])-1 {
				height = j + 1
				break
			}
		}

		if height > maxHeight {
			maxHeight = height
		}
	}
	height = maxHeight

	return height
}

func parseTable(cols [][]string, bound [4]int) models.Table {
	rows := make([]models.Row, bound[3]-bound[1]-2)
	for j := 0; j < len(rows); j++ {
		rows[j] = parseRow(cols, j+bound[1]+2, bound[0], bound[2])
	}

	return models.Table{
		Rows: rows,
	}
}

func parseRow(cols [][]string, offset int, start int, end int) models.Row {
	row := make([]string, end-start)
	for i, col := range cols[start:end] {
		if offset < len(col) {
			row[i] = col[offset]
		}
	}
	return row
}
