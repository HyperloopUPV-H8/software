package blcu

import (
	"net"

	"github.com/HyperloopUPV-H8/h9-backend/internal/vehicle/models"
	wsModels "github.com/HyperloopUPV-H8/h9-backend/internal/ws_handle/models"
	"github.com/rs/zerolog"
	trace "github.com/rs/zerolog/log"
)

type BLCU struct {
	addr       net.TCPAddr
	boardToId  map[string]uint16
	ackChannel chan struct{}

	sendOrder func(models.Order) error

	config BLCUConfig

	trace zerolog.Logger
}

func NewBLCU(laddr net.TCPAddr, boardIds map[string]uint16, config BLCUConfig) BLCU {
	trace.Info().Str("addr", laddr.String()).Msg("New BLCU")

	return BLCU{
		addr:       laddr,
		boardToId:  boardIds,
		ackChannel: make(chan struct{}, BLCU_ACK_CHAN_BUF),
		trace:      trace.With().Str("component", BLCU_COMPONENT_NAME).Logger(),
		config:     config,
		sendOrder:  func(o models.Order) error { return nil },
	}
}

func (blcu *BLCU) HandlerName() string {
	return BLCU_HANDLER_NAME
}

func (blcu *BLCU) SetSendOrder(sendOrder func(o models.Order) error) {
	blcu.sendOrder = sendOrder
}

func (blcu *BLCU) UpdateMessage(client wsModels.Client, msg wsModels.Message) {
	blcu.trace.Debug().Str("topic", msg.Topic).Str("client", client.Id()).Msg("Update message")
	switch msg.Topic {
	case blcu.config.Topics.Upload:
		err := blcu.upload(client, msg.Payload)
		if err != nil {
			blcu.notifyUploadFailure(client)
		} else {
			blcu.notifyUploadSuccess(client)
		}

	case blcu.config.Topics.Download:
		board, data, err := blcu.download(client, msg.Payload)
		if err != nil {
			blcu.notifyDownloadFailure(client)
		} else {
			blcu.notifyDownloadSuccess(client, data)
			blcu.writeDownloadFile(board, data)
		}
	}
}

func (blcu *BLCU) NotifyAck() {
	select {
	case blcu.ackChannel <- struct{}{}:
	default:
	}
}
