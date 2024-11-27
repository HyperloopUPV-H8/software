package internals

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
