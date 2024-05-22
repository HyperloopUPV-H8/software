package order

import (
	"encoding/json"
	"fmt"
	"sync"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/order"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
	"github.com/google/uuid"
	ws "github.com/gorilla/websocket"
)

const StateName abstraction.BrokerTopic = "order/stateOrders"

type State struct {
	enabledOrders map[string]map[abstraction.PacketId]struct{}
	idToBoard     map[uint16]string
	connectionMx  *sync.Mutex
	subscribers   map[websocket.ClientId]struct{}
	pool          *websocket.Pool
	api           abstraction.BrokerAPI
}

func NewState(idToBoard map[uint16]string) *State {
	enabled := make(map[string]map[abstraction.PacketId]struct{})
	for _, board := range idToBoard {
		enabled[board] = make(map[abstraction.PacketId]struct{})
	}

	return &State{
		enabledOrders: enabled,
		idToBoard:     idToBoard,
		connectionMx:  new(sync.Mutex),
		subscribers:   make(map[websocket.ClientId]struct{}),
	}
}

func (state *State) Topic() abstraction.BrokerTopic {
	return StateName
}

func (state *State) Push(push abstraction.BrokerPush) error {
	switch action := push.(type) {
	case *StateAdd:
		return state.addOrders(action.update)
	case *StateRemove:
		return state.removeOrders(action.update)
	default:
		fmt.Printf("unknown push type: %T", push)
		return topics.ErrUnexpectedPush{Push: push}
	}
}

func (state *State) addOrders(add *order.Add) error {
	for _, addedOrder := range add.Orders() {
		board, ok := state.idToBoard[uint16(addedOrder)]
		if !ok {
			fmt.Println("unrecoginzed id:", addedOrder)
			continue
		}

		state.enabledOrders[board][addedOrder] = struct{}{}
	}

	return state.updateOrders()
}

func (state *State) removeOrders(remove *order.Remove) error {
	for _, removedOrder := range remove.Orders() {
		board, ok := state.idToBoard[uint16(removedOrder)]
		if !ok {
			fmt.Println("unrecoginzed id:", removedOrder)
			continue
		}

		delete(state.enabledOrders[board], removedOrder)
	}

	return state.updateOrders()
}

func (state *State) updateOrders() error {
	orderList := make(map[string][]abstraction.PacketId, len(state.enabledOrders))
	for board, enabledOrders := range state.enabledOrders {
		orderList[board] = make([]abstraction.PacketId, 0, len(enabledOrders))
		for order := range enabledOrders {
			orderList[board] = append(orderList[board], order)
		}
	}

	payload, err := json.Marshal(orderList)
	if err != nil {
		return err
	}

	message := websocket.Message{
		Topic:   StateName,
		Payload: payload,
	}

	state.connectionMx.Lock()
	defer state.connectionMx.Unlock()
	flaged := make([]websocket.ClientId, 0, len(state.subscribers))
	for id := range state.subscribers {
		err := state.pool.Write(id, message)
		if err != nil {
			flaged = append(flaged, id)
		}
	}

	for _, id := range flaged {
		state.pool.Disconnect(id, ws.CloseInternalServerErr, "client disconnected")
		delete(state.subscribers, id)
		fmt.Printf("order/stateOrders unsubscribed %s\n", uuid.UUID(id).String())
	}

	return nil
}

func (state *State) Pull(request abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
	return nil, nil
}

func (state *State) ClientMessage(id websocket.ClientId, message *websocket.Message) {
	state.connectionMx.Lock()
	defer state.connectionMx.Unlock()

	switch message.Topic {
	case StateName:
		fmt.Printf("order/stateOrders subscribed %s\n", uuid.UUID(id).String())
		state.subscribers[id] = struct{}{}
	default:
		state.pool.Disconnect(id, ws.CloseUnsupportedData, "unsupported topic")
		delete(state.subscribers, id)
		fmt.Printf("order/stateOrders unsubscribed %s\n", uuid.UUID(id).String())
	}
}

func (state *State) SetPool(pool *websocket.Pool) {
	state.pool = pool
}

func (state *State) SetAPI(api abstraction.BrokerAPI) {
	state.api = api
}

type StateAdd struct {
	update *order.Add
}

func NewAdd(diff *order.Add) *StateAdd {
	return &StateAdd{
		update: diff,
	}
}

func (add *StateAdd) Topic() abstraction.BrokerTopic {
	return StateName
}

type StateRemove struct {
	update *order.Remove
}

func NewRemove(diff *order.Remove) *StateRemove {
	return &StateRemove{
		update: diff,
	}
}

func (remove *StateRemove) Topic() abstraction.BrokerTopic {
	return StateName
}
