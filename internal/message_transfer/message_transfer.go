package message_transfer

import (
	wsModels "github.com/HyperloopUPV-H8/h9-backend/internal/ws_handle/models"

	"github.com/HyperloopUPV-H8/h9-backend/internal/common/observable"
	"github.com/rs/zerolog"
	trace "github.com/rs/zerolog/log"
)

const (
	MessageTransferHandlerName = "messageTransfer"
	UpdateTopic                = "message/update"
)

type MessageTransfer struct {
	updateTopic       string
	messageObservable observable.NoReplayObservable[any]
	trace             zerolog.Logger
}
type MessageTransferConfig struct {
	UpdateTopic string `toml:"update_topic"`
}

func New(config MessageTransferConfig) MessageTransfer {
	trace.Info().Msg("new message transfer")
	return MessageTransfer{
		updateTopic:       config.UpdateTopic,
		messageObservable: observable.NewNoReplayObservable[any](),
		// messageObservable: observable.NewWsObservable[any](struct{}{}, func(v any, id string) error { return defaultSendMessage(id, v) }), //FIXME: change struct{}{}
		trace: trace.With().Str("component", MessageTransferHandlerName).Logger(),
	}
}

func (messageTransfer *MessageTransfer) SendMessage(message any) error {
	messageTransfer.messageObservable.Next(message)
	return nil
}

func (messageTransfer *MessageTransfer) UpdateMessage(client wsModels.Client, msg wsModels.Message) {
	messageTransfer.trace.Info().Str("client", client.Id()).Str("topic", msg.Topic).Msg("got message")

	observable.HandleSubscribe[any](&messageTransfer.messageObservable, msg, client)
}

func (messageTransfer *MessageTransfer) HandlerName() string {
	return MessageTransferHandlerName
}
