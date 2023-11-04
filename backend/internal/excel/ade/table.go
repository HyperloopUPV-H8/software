package ade

import (
	"fmt"
	"strings"

	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	doc "github.com/HyperloopUPV-H8/h9-backend/internal/excel/document"
)

type Table = [][]string

const TablePrefix = "[TABLE]"

func getTables(sheet [][]string) (map[string]Table, error) {
	tables := make(map[string]Table)

	for i, row := range sheet {
		for j, cell := range row {
			if strings.HasPrefix(cell, TablePrefix) {
				name := strings.TrimPrefix(cell, fmt.Sprintf("%s ", TablePrefix))
				table, err := getTableAutoSize(sheet, i, j)

				if err != nil {
					return nil, nil
				}

				tables[name] = table
			}
		}
	}

	return tables, nil
}

func findTable(sheet [][]string, name string, width int) (Table, bool) {
	row, col := findTableHeader(sheet, name)

	if row == -1 || col == -1 {
		return [][]string{}, false
	}

	if row == len(sheet)-1 {
		return make([][]string, 0), true
	}

	return getTableWithWidth(sheet, row+1, col, width), true
}

func findTableAutoSize(sheet doc.Sheet, name string) (Table, error) {
	row, col := findTableHeader(sheet, name)

	if row == -1 || col == -1 {
		return [][]string{}, fmt.Errorf("table %s not found", name)
	}

	table, err := getTableAutoSize(sheet, row, col)

	if err != nil {
		return [][]string{}, err
	}

	return table, nil
}

func findTableHeader(sheet doc.Sheet, name string) (int, int) { // returns row, col
	for i, row := range sheet {
		for k, cell := range row {
			if cell == fmt.Sprint(TablePrefix, " ", name) {
				return i, k
			}
		}
	}

	return -1, -1
}

func getTableWithWidth(sheet doc.Sheet, row int, col int, width int) Table {
	colLength := getLongestColumn(sheet, row, col, width)
	return getSubmatrix(sheet, row, width, col, colLength)
}

func getTableAutoSize(sheet doc.Sheet, row int, column int) ([][]string, error) {
	if row == len(sheet)-1 {
		return [][]string{}, fmt.Errorf("table header is in the last row")
	}

	rowLength := getRowLength(sheet[row+1][column:])
	columnLength := getLongestColumn(sheet, row+1, column, rowLength)

	return getSubmatrix(sheet, row+1, rowLength, column, columnLength), nil
}

func getRowLength(row []string) int {
	if len(row) == 0 {
		return 0
	}

	for i, cell := range row {
		if cell == "" {
			return i
		}
	}

	return len(row)
}

func getLongestColumn(sheet doc.Sheet, row int, col int, nCols int) int {
	for i := row; i < len(sheet); i++ {
		if isRowEmpty(sheet[i][col : col+nCols]) {
			return i - row
		}
	}

	return len(sheet) - row
}

func isRowEmpty(row []string) bool {
	return common.Every(row, func(item string) bool {
		return item == ""
	})
}

func getSubmatrix[T any](matrix [][]T, startRow int, rowLength int, startCol int, colLength int) [][]T {
	rows := matrix[startRow : startRow+colLength]

	submatrix := make([][]T, len(rows))

	for index, row := range rows {
		submatrix[index] = row[startCol : startCol+rowLength]
	}

	return submatrix
}
