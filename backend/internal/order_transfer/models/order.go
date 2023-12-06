package models

type Order struct {
	Id     uint16           `json:"id"`
	Fields map[string]Field `json:"fields"`
}

type Field struct {
	Value     any    `json:"value"`
	IsEnabled bool   `json:"isEnabled"`
	Type      string `json:"type"`
}
