package lifecycle

import (
	"encoding/json"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/lifecycle"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
	ws "github.com/gorilla/websocket"
)

const ShutdownRequestName abstraction.BrokerTopic = "lifecycle/shutdown"
const ShutdownResponseName abstraction.BrokerTopic = "lifecycle/shutdownResponse"

type ShutdownRequest struct {
	Reason string `json:"reason"`
}

type ShutdownResponse struct {
	Acknowledged bool   `json:"acknowledged"`
	Message      string `json:"message"`
}

type ShutdownTopic struct {
	pool    *websocket.Pool
	api     abstraction.BrokerAPI
	manager *lifecycle.Manager
}

func NewShutdownTopic(manager *lifecycle.Manager) *ShutdownTopic {
	return &ShutdownTopic{
		manager: manager,
	}
}

func (t *ShutdownTopic) Topic() abstraction.BrokerTopic {
	return ShutdownRequestName
}

func (t *ShutdownTopic) Push(push abstraction.BrokerPush) error {
	return topics.ErrOpNotSupported{}
}

func (t *ShutdownTopic) Pull(request abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
	return nil, topics.ErrOpNotSupported{}
}

func (t *ShutdownTopic) ClientMessage(id websocket.ClientId, message *websocket.Message) {
	// Parse shutdown request
	var req ShutdownRequest
	if err := json.Unmarshal(message.Payload, &req); err != nil {
		t.pool.Disconnect(id, ws.CloseUnsupportedData, "invalid shutdown request")
		return
	}

	// Send acknowledgment
	response := ShutdownResponse{
		Acknowledged: true,
		Message:      "Shutdown initiated",
	}

	respData, _ := json.Marshal(response)
	t.pool.Write(id, websocket.Message{
		Topic:   ShutdownResponseName,
		Payload: respData,
	})

	// Trigger shutdown
	go func() {
		time.Sleep(100 * time.Millisecond) // Let response send
		t.manager.Shutdown(5 * time.Second)
	}()
}

func (t *ShutdownTopic) SetPool(pool *websocket.Pool) {
	t.pool = pool
}

func (t *ShutdownTopic) SetAPI(api abstraction.BrokerAPI) {
	t.api = api
}