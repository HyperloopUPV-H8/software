package state_space_logger

import (
	"strconv"

	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/HyperloopUPV-H8/h9-backend/internal/file_logger"
)

func NewStateSpaceLogger(stateSpaceId uint16) file_logger.FileLogger {
	ids := common.NewSet[string]()
	ids.Add(strconv.Itoa(int(stateSpaceId)))
	return file_logger.NewFileLogger("stateSpaceLogger", ids, file_logger.Config{
		FileName:      "stateSpace",
		FlushInterval: "3s",
	})
}
