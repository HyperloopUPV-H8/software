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
	PropagateFault bool `toml:"propagate_fault"`
}

type TFTP struct {
	BlockSize      int  `toml:"block_size"`
	Retries        int  `toml:"retries"`
	TimeoutMs      int  `toml:"timeout_ms"`
	BackoffFactor  int  `toml:"backoff_factor"`
	EnableProgress bool `toml:"enable_progress"`
}

type Blcu struct {
	IP              string `toml:"ip"`
	DownloadOrderId uint16 `toml:"download_order_id"`
	UploadOrderId   uint16 `toml:"upload_order_id"`
}

type TCP struct {
	BackoffMinMs       int     `toml:"backoff_min_ms"`        // Minimum backoff duration in milliseconds
	BackoffMaxMs       int     `toml:"backoff_max_ms"`        // Maximum backoff duration in milliseconds
	BackoffMultiplier  float64 `toml:"backoff_multiplier"`    // Exponential backoff multiplier
	MaxRetries         int     `toml:"max_retries"`           // Maximum number of retries before cycling (0 or negative = infinite)
	ConnectionTimeout  int     `toml:"connection_timeout_ms"` // Connection timeout in milliseconds
	KeepAlive          int     `toml:"keep_alive_ms"`         // Keep-alive interval in milliseconds
}

type Config struct {
	Vehicle   vehicle.Config
	Server    server.Config
	Adj       Adj
	Network   Network
	Transport Transport
	TFTP      TFTP
	TCP       TCP
	Blcu      Blcu
}
