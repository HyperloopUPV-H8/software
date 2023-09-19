package main

import (
	"github.com/HyperloopUPV-H8/h9-backend/internal/blcu"
	"github.com/HyperloopUPV-H8/h9-backend/internal/connection_transfer"
	"github.com/HyperloopUPV-H8/h9-backend/internal/data_transfer"
	"github.com/HyperloopUPV-H8/h9-backend/internal/excel_adapter"
	"github.com/HyperloopUPV-H8/h9-backend/internal/file_logger"
	"github.com/HyperloopUPV-H8/h9-backend/internal/logger_handler"
	"github.com/HyperloopUPV-H8/h9-backend/internal/message_transfer"
	"github.com/HyperloopUPV-H8/h9-backend/internal/server"
	"github.com/HyperloopUPV-H8/h9-backend/internal/value_logger"
	"github.com/HyperloopUPV-H8/h9-backend/internal/vehicle"
)

type Config struct {
	Excel            excel_adapter.ExcelAdapterConfig
	Connections      connection_transfer.ConnectionTransferConfig
	LoggerHandler    logger_handler.Config `toml:"logger_handler"`
	PacketLogger     file_logger.Config    `toml:"packet_logger"`
	ValueLogger      value_logger.Config   `toml:"value_logger"`
	OrderLogger      file_logger.Config    `toml:"order_logger"`
	ProtectionLogger file_logger.Config    `toml:"protection_logger"`
	Vehicle          vehicle.Config
	DataTransfer     data_transfer.DataTransferConfig `toml:"data_transfer"`
	Orders           struct {
		SendTopic string `toml:"send_topic"`
	}
	Messages message_transfer.MessageTransferConfig
	Server   server.Config
	BLCU     blcu.BLCUConfig `toml:"blcu"`
}
