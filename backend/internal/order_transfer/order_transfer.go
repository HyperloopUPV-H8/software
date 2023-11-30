package order_transfer

import (
	"encoding/json"
	"sync"

	"github.com/HyperloopUPV-H8/h9-backend/internal/order_transfer/models"
	wsModels "github.com/HyperloopUPV-H8/h9-backend/internal/ws_handle/models"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/data"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/order"

	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/HyperloopUPV-H8/h9-backend/internal/common/observable"
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
	idToBoard             map[uint16]string
	stateOrders           map[string][]uint16
	stateOrdersObservable observable.ReplayObservable[map[string][]uint16]
	channel               chan<- data.Packet
	trace                 zerolog.Logger
}

func New(idToBoard map[uint16]string) (OrderTransfer, <-chan data.Packet) {
	trace.Info().Msg("new order transfer")
	channel := make(chan data.Packet, ORDER_CHAN_BUFFER)
	stateOrders := make(map[string][]uint16)
	return OrderTransfer{
		stateOrdersMx:         &sync.Mutex{},
		idToBoard:             idToBoard,
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

func (orderTransfer *OrderTransfer) AddStateOrders(stateOrders order.Add) {
	orderTransfer.stateOrdersMx.Lock()
	defer orderTransfer.stateOrdersMx.Unlock()
	for _, order := range stateOrders.Orders() {
		orderTransfer.stateOrders[orderTransfer.idToBoard[uint16(order)]] = common.Union(orderTransfer.stateOrders[orderTransfer.idToBoard[uint16(order)]], uint16(order))
	}
	orderTransfer.stateOrdersObservable.Next(orderTransfer.stateOrders)
}

func (orderTransfer *OrderTransfer) RemoveStateOrders(stateOrders order.Remove) {
	orderTransfer.stateOrdersMx.Lock()
	defer orderTransfer.stateOrdersMx.Unlock()
	for _, order := range stateOrders.Orders() {
		orderTransfer.stateOrders[orderTransfer.idToBoard[uint16(order)]] = common.Subtract(orderTransfer.stateOrders[orderTransfer.idToBoard[uint16(order)]], uint16(order))
	}
	orderTransfer.stateOrdersObservable.Next(orderTransfer.stateOrders)
}

func (orderTransfer *OrderTransfer) handleOrder(topic string, payload json.RawMessage, source string) {
	var order models.Order
	if err := json.Unmarshal(payload, &order); err != nil {
		orderTransfer.trace.Error().Stack().Err(err).Msg("")
		return
	}
	orderTransfer.trace.Info().Str("source", source).Str("topic", topic).Uint16("id", order.Id).Msg("send order")

	values := make(map[data.ValueName]data.Value)
	enabled := make(map[data.ValueName]bool)
	for name, field := range order.Fields {
		enabled[data.ValueName(name)] = field.IsEnabled
		switch field.Type {
		case "uint8":
			values[data.ValueName(name)] = data.NewNumericValue[uint8](field.Value.(uint8))
		case "uint16":
			values[data.ValueName(name)] = data.NewNumericValue[uint16](field.Value.(uint16))
		case "uint32":
			values[data.ValueName(name)] = data.NewNumericValue[uint32](field.Value.(uint32))
		case "uint64":
			values[data.ValueName(name)] = data.NewNumericValue[uint64](field.Value.(uint64))
		case "int8":
			values[data.ValueName(name)] = data.NewNumericValue[int8](field.Value.(int8))
		case "int16":
			values[data.ValueName(name)] = data.NewNumericValue[int16](field.Value.(int16))
		case "int32":
			values[data.ValueName(name)] = data.NewNumericValue[int32](field.Value.(int32))
		case "int64":
			values[data.ValueName(name)] = data.NewNumericValue[int64](field.Value.(int64))
		case "float32":
			values[data.ValueName(name)] = data.NewNumericValue[float32](field.Value.(float32))
		case "float64":
			values[data.ValueName(name)] = data.NewNumericValue[float64](field.Value.(float64))
		case "bool":
			values[data.ValueName(name)] = data.NewBooleanValue(field.Value.(bool))
		case "enum":
			values[data.ValueName(name)] = data.NewEnumValue(data.EnumVariant(field.Value.(string)))
		default:
			panic("unknown field type " + field.Type)
		}
	}
	orderTransfer.channel <- *data.NewPacketWithValues(abstraction.PacketId(order.Id), values, enabled)
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
