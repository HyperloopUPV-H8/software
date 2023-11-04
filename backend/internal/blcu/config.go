package blcu

type BLCUConfig struct {
	Packets struct {
		Upload   PacketData
		Download PacketData
		Ack      PacketData
	}

	DownloadPath string `toml:"download_path,omitempty"`

	Topics struct {
		Upload   string
		Download string
	}
}

type PacketData struct {
	Id    uint16 `toml:"id,omitempty"`
	Field string `toml:"field,omitempty"`
	Name  string `toml:"name,omitempty"`
}

const (
	BLCU_COMPONENT_NAME = "blcu"
	BLCU_BOARD_NAME     = "blcu"
	BLCU_HANDLER_NAME   = "blcu"
	BLCU_INPUT_CHAN_BUF = 100
	BLCU_ACK_CHAN_BUF   = 1
)
