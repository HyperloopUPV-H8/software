package main

import (
	"github.com/HyperloopUPV-H8/h9-backend/internal/server"
	"github.com/HyperloopUPV-H8/h9-backend/internal/vehicle"
)

type Adj struct {
	Branch string
}
type Config struct {
	Vehicle vehicle.Config
	Server  server.Config
	Adj     Adj
}
