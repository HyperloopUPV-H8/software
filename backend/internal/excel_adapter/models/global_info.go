package models

type GlobalInfo struct {
	BackendIP        string
	BoardToIP        map[string]string
	UnitToOperations map[string]string
	ProtocolToPort   map[string]string
	BoardToId        map[string]string
	MessageToId      map[string]string
}
