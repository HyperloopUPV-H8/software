package main

import (
	"github.com/HyperloopUPV-H8/h9-backend/internal/server"
	"github.com/HyperloopUPV-H8/h9-backend/internal/vehicle"
)

type Adj struct {
	Branch string
	Test   bool
}

type Network struct {
	Manual bool
}

type Transport struct {
	PropagateFault bool
}

type Config struct {
	Vehicle   vehicle.Config
	Server    server.Config
	Adj       Adj
	Network   Network
	Transport Transport
}
