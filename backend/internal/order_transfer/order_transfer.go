package order_transfer

import (
	"encoding/json"
	"sync"

	wsModels "github.com/HyperloopUPV-H8/h9-backend/internal/ws_handle/models"

	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/HyperloopUPV-H8/h9-backend/internal/common/observable"
	vehicle_models "github.com/HyperloopUPV-H8/h9-backend/internal/vehicle/models"
	"github.com/rs/zerolog"
	trace "github.com/rs/zerolog/log"
)

const (
	ORDER_TRASNFER_NAME = "orderTransfer"
	ORDER_CHAN_BUFFER   = 100

	OrderTopic = "orders/enabled" // TODO: move to config
)

type OrderTransfer struct {
	stateOrdersMx         *sync.Mutex
	stateOrders           map[string][]uint16
	stateOrdersObservable observable.ReplayObservable[map[string][]uint16]
	channel               chan<- vehicle_models.Order
	trace                 zerolog.Logger
}

func New() (OrderTransfer, <-chan vehicle_models.Order) {
	trace.Info().Msg("new order transfer")
	channel := make(chan vehicle_models.Order, ORDER_CHAN_BUFFER)
	stateOrders := make(map[string][]uint16)
	return OrderTransfer{
		stateOrdersMx:         &sync.Mutex{},
		channel:               channel,
		stateOrders:           stateOrders,
		stateOrdersObservable: observable.NewReplayObservable(stateOrders),
		trace:                 trace.With().Str("component", ORDER_TRASNFER_NAME).Logger(),
	}, channel
}

func (orderTransfer *OrderTransfer) UpdateMessage(client wsModels.Client, msg wsModels.Message) {
	orderTransfer.trace.Info().Str("client", client.Id()).Str("topic", msg.Topic).Msg("got message")
	switch msg.Topic {
	case "order/send":
		orderTransfer.handleOrder(msg.Topic, msg.Payload, client.Id())
	case "order/stateOrders":
		orderTransfer.handleSubscription(client, msg)
	}
}

func (orderTransfer *OrderTransfer) handleSubscription(client wsModels.Client, msg wsModels.Message) {
	observable.HandleSubscribe[map[string][]uint16](&orderTransfer.stateOrdersObservable, msg, client)
}

func (orderTransfer *OrderTransfer) AddStateOrders(stateOrders vehicle_models.StateOrdersMessage) {
	orderTransfer.stateOrdersMx.Lock()
	defer orderTransfer.stateOrdersMx.Unlock()
	orderTransfer.stateOrders[stateOrders.BoardId] = common.Union(orderTransfer.stateOrders[stateOrders.BoardId], stateOrders.Orders...)
	orderTransfer.stateOrdersObservable.Next(orderTransfer.stateOrders)
}

func (orderTransfer *OrderTransfer) RemoveStateOrders(stateOrders vehicle_models.StateOrdersMessage) {
	orderTransfer.stateOrdersMx.Lock()
	defer orderTransfer.stateOrdersMx.Unlock()
	orderTransfer.stateOrders[stateOrders.BoardId] = common.Subtract(orderTransfer.stateOrders[stateOrders.BoardId], stateOrders.Orders...)
	orderTransfer.stateOrdersObservable.Next(orderTransfer.stateOrders)
}

func (orderTransfer *OrderTransfer) handleOrder(topic string, payload json.RawMessage, source string) {
	var order vehicle_models.Order
	if err := json.Unmarshal(payload, &order); err != nil {
		orderTransfer.trace.Error().Stack().Err(err).Msg("")
		return
	}
	orderTransfer.trace.Info().Str("source", source).Str("topic", topic).Uint16("id", order.ID).Msg("send order")
	orderTransfer.channel <- order
}

func (orderTransfer *OrderTransfer) HandlerName() string {
	return ORDER_TRASNFER_NAME
}

func (orderTransfer *OrderTransfer) ClearOrders(board string) {
	orderTransfer.stateOrdersMx.Lock()
	defer orderTransfer.stateOrdersMx.Unlock()
	orderTransfer.stateOrders[board] = []uint16{}
	orderTransfer.stateOrdersObservable.Next(orderTransfer.stateOrders)
}
