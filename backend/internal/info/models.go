package info

import (
	"net"

	"github.com/HyperloopUPV-H8/h9-backend/internal/excel/utils"
)

type Info struct {
	Addresses  Addresses
	Units      map[string]utils.Operations
	Ports      Ports
	BoardIds   map[string]uint16
	MessageIds MessageIds
}

type MessageIds struct {
	Warning          uint16
	Fault            uint16
	BlcuAck          uint16
	Info             uint16
	AddStateOrder    uint16
	RemoveStateOrder uint16
	StateSpace       uint16
}

type Addresses struct {
	Backend net.IP
	Boards  map[string]net.IP
}

type Ports struct {
	UDP       uint16
	TcpServer uint16
	TcpClient uint16
	TFTP      uint16
	SNTP      uint16
}
