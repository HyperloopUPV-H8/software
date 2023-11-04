package connection_transfer

type ConnectionSubscription = bool

type Connection struct {
	Name        string `json:"name"`
	IsConnected bool   `json:"isConnected"`
}
