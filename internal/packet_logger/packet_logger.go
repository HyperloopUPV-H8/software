package packet_logger

import (
	"strconv"

	"github.com/HyperloopUPV-H8/Backend-H8/common"
	"github.com/HyperloopUPV-H8/Backend-H8/file_logger"
	"github.com/HyperloopUPV-H8/Backend-H8/pod_data"
)

func NewPacketLogger(boards []pod_data.Board, config file_logger.Config) file_logger.FileLogger {
	ids := getIds(boards)

	return file_logger.NewFileLogger("packetLogger", ids, config)
}

func getIds(boards []pod_data.Board) common.Set[string] {
	ids := common.NewSet[string]()

	for _, board := range boards {
		for _, packet := range board.Packets {
			ids.Add(strconv.Itoa(int(packet.Id)))
		}
	}

	return ids
}
