package order_logger

import (
	"strconv"

	"github.com/HyperloopUPV-H8/Backend-H8/common"
	"github.com/HyperloopUPV-H8/Backend-H8/file_logger"
	"github.com/HyperloopUPV-H8/Backend-H8/pod_data"
)

func NewOrderLogger(boards []pod_data.Board, config file_logger.Config) file_logger.FileLogger {
	ids := common.NewSet[string]()

	for _, board := range boards {
		for _, packet := range board.Packets {
			if packet.Type == "order" {
				ids.Add(strconv.Itoa(int(packet.Id)))
			}
		}
	}

	fileLogger := file_logger.NewFileLogger("orderLogger", ids, config)

	return fileLogger
}
