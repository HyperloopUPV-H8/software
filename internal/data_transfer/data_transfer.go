package data_transfer

import (
	"sync"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/internal/common/observable"
	"github.com/HyperloopUPV-H8/h9-backend/internal/update_factory/models"
	wsModels "github.com/HyperloopUPV-H8/h9-backend/internal/ws_handle/models"

	"github.com/rs/zerolog"
	trace "github.com/rs/zerolog/log"
)

const (
	DataTransferHandlerName = "dataTransfer"
	UpdateTopic             = "podData/update"
)

type DataTransfer struct {
	bufMx            *sync.Mutex
	updateBuf        map[uint16]models.Update
	updateObservable observable.ReplayObservable[map[uint16]models.Update]
	ticker           *time.Ticker
	updateTopic      string
	trace            zerolog.Logger
}
type DataTransferTopics struct {
	Update string
}
type DataTransferConfig struct {
	Fps    uint
	Topics DataTransferTopics
}

func New(config DataTransferConfig) DataTransfer {
	trace.Info().Msg("create data transfer")

	dataTransfer := DataTransfer{
		bufMx:            &sync.Mutex{},
		updateBuf:        make(map[uint16]models.Update),
		updateObservable: observable.NewReplayObservable(make(map[uint16]models.Update)),
		ticker:           time.NewTicker(time.Second / time.Duration(config.Fps)),
		updateTopic:      config.Topics.Update,
		trace:            trace.With().Str("component", DataTransferHandlerName).Logger(),
	}

	return dataTransfer
}

func (dataTransfer *DataTransfer) UpdateMessage(client wsModels.Client, msg wsModels.Message) {
	dataTransfer.trace.Info().Str("source", client.Id()).Str("topic", msg.Topic).Msg("got message")

	observable.HandleSubscribe[map[uint16]models.Update](&dataTransfer.updateObservable, msg, client)
}

func (DataTransfer *DataTransfer) HandlerName() string {
	return DataTransferHandlerName
}

func (dataTransfer *DataTransfer) Run() {
	dataTransfer.trace.Info().Msg("run")
	for {
		<-dataTransfer.ticker.C
		dataTransfer.trySend()
	}
}

func (dataTransfer *DataTransfer) trySend() {
	dataTransfer.bufMx.Lock()
	defer dataTransfer.bufMx.Unlock()

	if len(dataTransfer.updateBuf) == 0 {
		return
	}

	dataTransfer.sendBuf()
}

func (dataTransfer *DataTransfer) sendBuf() {
	dataTransfer.trace.Trace().Msg("send buffer")
	dataTransfer.updateObservable.Next(dataTransfer.updateBuf)
	dataTransfer.updateBuf = make(map[uint16]models.Update, len(dataTransfer.updateBuf))
}

func (dataTransfer *DataTransfer) Update(update models.Update) {
	dataTransfer.bufMx.Lock()
	defer dataTransfer.bufMx.Unlock()
	dataTransfer.trace.Trace().Uint16("id", update.Id).Msg("update")
	dataTransfer.updateBuf[update.Id] = update
}
