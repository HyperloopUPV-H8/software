package data

import (
	"encoding/json"
	"fmt"
	"sync/atomic"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
)

const EnableName abstraction.BrokerTopic = "logger/enable"
const ResponseName abstraction.BrokerTopic = "logger/response"

type Enable struct {
	isRunning *atomic.Bool
	pool      *websocket.Pool
	api       abstraction.BrokerAPI
}

func NewEnableTopic() *Enable {
	enable := &Enable{
		isRunning: &atomic.Bool{},
	}
	enable.isRunning.Store(false)
	return enable
}

func (enable *Enable) Topic() abstraction.BrokerTopic {
	return EnableName
}

func (enable *Enable) Push(push abstraction.BrokerPush) error {
	return nil
}

func (enable *Enable) Pull(request abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
	return nil, nil
}

func (enable *Enable) ClientMessage(id websocket.ClientId, message *websocket.Message) {
	switch message.Topic {
	case EnableName:
		err := enable.handleToggle(id, message)
		if err != nil {
			fmt.Printf("error handling logger: %v\n", err)
		}
	}
}

func (enable *Enable) handleToggle(id websocket.ClientId, message *websocket.Message) error {
	var request bool
	err := json.Unmarshal(message.Payload, &request)
	if err != nil {
		return err
	}

	status := NewStatus(request)
	go enable.api.UserPush(status)

	go func() {
		enable.isRunning.Store(<-status.response)
		enable.broadcastState()
	}()
	return nil
}

func (enable *Enable) broadcastState() error {
	payload, err := json.Marshal(enable.isRunning.Load())
	if err != nil {
		return err
	}

	enable.pool.Broadcast(websocket.Message{
		Topic:   ResponseName,
		Payload: payload,
	})
	return nil
}

func (enable *Enable) SetPool(pool *websocket.Pool) {
	enable.pool = pool
}

func (enable *Enable) SetAPI(api abstraction.BrokerAPI) {
	enable.api = api
}

type Status struct {
	request  bool
	response chan bool
}

func NewStatus(request bool) *Status {
	return &Status{
		request:  request,
		response: make(chan bool),
	}
}

func (status Status) Topic() abstraction.BrokerTopic {
	return EnableName
}

func (status *Status) Fulfill(response bool) {
	status.response <- response
}

func (status *Status) Enable() bool {
	return status.request
}
