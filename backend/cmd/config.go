package main

import (
	"github.com/HyperloopUPV-H8/h9-backend/internal/server"
	"github.com/HyperloopUPV-H8/h9-backend/internal/vehicle"
)

type App struct {
	AutomaticWindowOpening string `toml:"automatic_window_opening"`
	ShutdownMode          string `toml:"shutdown_mode"`
	ShutdownGracePeriod   int    `toml:"shutdown_grace_period"`
}

type Dev struct {
	DevMode              bool `toml:"dev_mode"`
	ControlStationPort   int  `toml:"control_station_port"`
	EthernetViewPort     int  `toml:"ethernet_view_port"`
}

type Adj struct {
	Branch string `toml:"branch"`
	Test   bool   `toml:"test"`
}

type Network struct {
	Manual bool `toml:"manual"`
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
	BackoffMinMs      int     `toml:"backoff_min_ms"`
	BackoffMaxMs      int     `toml:"backoff_max_ms"`
	BackoffMultiplier float64 `toml:"backoff_multiplier"`
	MaxRetries        int     `toml:"max_retries"`
	ConnectionTimeout int     `toml:"connection_timeout_ms"`
	KeepAlive         int     `toml:"keep_alive_ms"`
}

type Config struct {
	App       App
	Dev       Dev
	Vehicle   vehicle.Config
	Server    server.Config
	Adj       Adj
	Network   Network
	Transport Transport
	TFTP      TFTP
	TCP       TCP
	Blcu      Blcu
}
