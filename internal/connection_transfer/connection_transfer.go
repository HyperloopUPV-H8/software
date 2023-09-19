package connection_transfer

import (
	"sync"

	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/HyperloopUPV-H8/h9-backend/internal/common/observable"
	wsModels "github.com/HyperloopUPV-H8/h9-backend/internal/ws_handle/models"

	"github.com/rs/zerolog"
	trace "github.com/rs/zerolog/log"
)

const (
	ConnectionTransferHandlerName = "connectionTransfer"
	UpdateTopic                   = "connection/update"
)

type ConnectionTransfer struct {
	writeMx               *sync.Mutex
	boardStatus           map[string]Connection
	boardStatusObservable observable.ReplayObservable[[]Connection]
	updateTopic           string
	trace                 zerolog.Logger
}

type ConnectionTransferConfig struct {
	UpdateTopic string `toml:"update_topic"`
}

func New(config ConnectionTransferConfig) ConnectionTransfer {
	trace.Info().Msg("new connection transfer")

	return ConnectionTransfer{
		writeMx:               &sync.Mutex{},
		boardStatus:           make(map[string]Connection),
		boardStatusObservable: observable.NewReplayObservable(make([]Connection, 0)),
		updateTopic:           config.UpdateTopic,
		trace:                 trace.With().Str("component", ConnectionTransferHandlerName).Logger(),
	}
}

func (connectionTransfer *ConnectionTransfer) UpdateMessage(client wsModels.Client, msg wsModels.Message) {
	connectionTransfer.trace.Trace().Str("topic", msg.Topic).Str("client", client.Id()).Msg("got message")

	observable.HandleSubscribe[[]Connection](&connectionTransfer.boardStatusObservable, msg, client)
}

func (connectionTransfer *ConnectionTransfer) HandlerName() string {
	return ConnectionTransferHandlerName
}

func (connectionTransfer *ConnectionTransfer) Update(name string, IsConnected bool) {
	connectionTransfer.writeMx.Lock()
	defer connectionTransfer.writeMx.Unlock()

	connectionTransfer.trace.Debug().Str("connection", name).Bool("isConnected", IsConnected).Msg("update connection state")

	connectionTransfer.boardStatus[name] = Connection{
		Name:        name,
		IsConnected: IsConnected,
	}

	connectionTransfer.boardStatusObservable.Next(common.Values(connectionTransfer.boardStatus))
}
