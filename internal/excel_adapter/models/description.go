package models

import "github.com/HyperloopUPV-H8/h9-backend/internal/excel_adapter/internals/models"

type Description struct {
	ID   string
	Name string
	Type string
}

func newDescription(row models.Row) Description {
	return Description{
		ID:   row[0],
		Name: row[1],
		Type: row[2],
	}
}

func descriptionWithID(desc Description, id string) Description {
	return Description{
		ID:   id,
		Name: desc.Name,
		Type: desc.Type,
	}
}

func descriptionWithName(desc Description, name string) Description {
	return Description{
		ID:   desc.ID,
		Name: name,
		Type: desc.Type,
	}
}
