package models

type Document struct {
	Info        Sheet
	BoardSheets map[string]Sheet
}
