package protection_logger

import (
	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/HyperloopUPV-H8/h9-backend/internal/file_logger"
)

func NewMessageLogger(infoId string, warningId string, faultId string, config file_logger.Config) file_logger.FileLogger {
	ids := common.NewSet[string]()
	ids.Add(infoId)
	ids.Add(warningId)
	ids.Add(faultId)

	fileLogger := file_logger.NewFileLogger("orderLogger", ids, config)

	return fileLogger
}
