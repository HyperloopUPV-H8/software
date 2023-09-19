package message_parser

import (
	"github.com/HyperloopUPV-H8/h9-backend/internal/info"
	"github.com/HyperloopUPV-H8/h9-backend/internal/pod_data"
	"github.com/rs/zerolog"
	trace "github.com/rs/zerolog/log"
)

func NewMessageParser(info info.Info, podData pod_data.PodData) MessageParser {
	parserLogger := trace.With().Str("component", "protection parser").Logger()

	idToBoard := getIdToBoard(info.BoardIds, parserLogger)

	return MessageParser{
		infoId:             info.MessageIds.Info,
		warningId:          info.MessageIds.Warning,
		faultId:            info.MessageIds.Fault,
		idToBoardId:        getIdToBoardId(info.BoardIds, podData),
		boardIdToName:      idToBoard,
		trace:              parserLogger,
		addStateOrderId:    info.MessageIds.AddStateOrder,
		removeStateOrderId: info.MessageIds.RemoveStateOrder,
	}
}

func getIdToBoardId(boardId map[string]uint16, podData pod_data.PodData) map[uint16]uint16 {
	idToBoardId := make(map[uint16]uint16)
	for _, board := range podData.Boards {
		board := board
		for _, packet := range board.Packets {
			packet := packet
			idToBoardId[packet.Id] = boardId[board.Name]
		}
	}
	return idToBoardId
}

func getIdToBoard(boardToId map[string]uint16, trace zerolog.Logger) map[uint16]string {
	idToBoard := make(map[uint16]string)

	for board, id := range boardToId {

		idToBoard[id] = board
	}

	return idToBoard
}
