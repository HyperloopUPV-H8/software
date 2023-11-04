package models

import "github.com/HyperloopUPV-H8/h9-backend/internal/excel_adapter/internals/models"

type Value struct {
	ID           string
	Name         string
	Type         string
	PodUnits     string
	DisplayUnits string
	SafeRange    string
	WarningRange string
}

func newValue(row models.Row) Value {
	return Value{
		ID:           row[0],
		Name:         row[1],
		Type:         row[2],
		PodUnits:     row[3],
		DisplayUnits: row[4],
		SafeRange:    row[5],
		WarningRange: row[6],
	}
}

func valuesWithSuffix(values []Value, sufix string) []Value {
	valuesWithSufix := make([]Value, len(values))
	for i, value := range values {
		value.Name = value.Name + sufix
		valuesWithSufix[i] = value
	}
	return valuesWithSufix
}
