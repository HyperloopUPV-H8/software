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

type TFTP struct {
	BlockSize      int  `toml:"block_size"`
	Retries        int  `toml:"retries"`
	TimeoutMs      int  `toml:"timeout_ms"`
	BackoffFactor  int  `toml:"backoff_factor"`
	EnableProgress bool `toml:"enable_progress"`
}

type Blcu struct {
	IP              string
	DownloadOrderId uint16
	UploadOrderId   uint16
}

type Config struct {
	Vehicle   vehicle.Config
	Server    server.Config
	Adj       Adj
	Network   Network
	Transport Transport
	TFTP      TFTP
	Blcu      Blcu
}
