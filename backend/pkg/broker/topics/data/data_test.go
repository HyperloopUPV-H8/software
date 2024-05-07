package data_test

import (
	"encoding/json"
	"github.com/HyperloopUPV-H8/h9-backend/internal/update_factory/models"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/blcu"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/data"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
	ws "github.com/gorilla/websocket"
	"github.com/rs/zerolog"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/url"
	"os"
	"testing"
	"time"
)

type MockAPI struct {
	messageChan chan abstraction.BrokerPush
}

func NewMockAPI() MockAPI {
	return MockAPI{messageChan: make(chan abstraction.BrokerPush)}
}

func (m MockAPI) UserPush(push abstraction.BrokerPush) error {
	m.messageChan <- push
	return nil
}

func (m MockAPI) UserPull(pull abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
	m.messageChan <- pull
	return nil, nil
}

func TestUpdatePush(t *testing.T) {
	logger := zerolog.New(os.Stdout)
	u := url.URL{Scheme: "ws", Host: "localhost:8080", Path: "/data"}

	clientChan := make(chan *websocket.Client)
	http.HandleFunc("/data", func(writer http.ResponseWriter, request *http.Request) {
		upgrader := websocket.NewUpgrader(clientChan, logger)
		upgrader.Upgrade(writer, request, nil)
	})
	go http.ListenAndServe(":8080", nil)

	c, _, err := ws.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		t.Fatal("Error dialing:", err)
	}

	api := NewMockAPI()
	pool := websocket.NewPool(clientChan, logger)

	websocket.NewClient(c)

	update := data.NewUpdateTopic(1 * time.Millisecond)
	update.SetPool(pool)
	update.SetAPI(api)

	go func() {
		for {
			message := <-api.messageChan
			packet := message.(*data.Push).Update()
			if packet.HexValue != "test" || packet.Count != 0 || packet.CycleTime != 0 || packet.Values != nil {
				t.Error("Output does not match input")
				return
			}
		}
	}()

	err = update.Push(data.NewPush(&models.Update{
		Id:        0,
		HexValue:  "test",
		Count:     0,
		CycleTime: 0,
		Values:    nil,
	}))

	assert.NoError(t, err)
}

func TestClientMessage(t *testing.T) {
	logger := zerolog.New(os.Stdout)
	u := url.URL{Scheme: "ws", Host: "localhost:8080", Path: "/datacm"}

	clientChan := make(chan *websocket.Client)
	http.HandleFunc("/datacm", func(writer http.ResponseWriter, request *http.Request) {
		upgrader := websocket.NewUpgrader(clientChan, logger)
		upgrader.Upgrade(writer, request, nil)
	})
	go http.ListenAndServe(":8080", nil)

	c, _, err := ws.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		t.Fatal("Error dialing:", err)
	}

	api := NewMockAPI()
	pool := websocket.NewPool(clientChan, logger)

	websocket.NewClient(c)

	update := data.NewUpdateTopic(1 * time.Millisecond)
	update.SetPool(pool)
	update.SetAPI(api)

	go func() {
		for {
			message := <-api.messageChan
			packet := message.(blcu.UploadRequest)
			if packet.Board != "test" || string(packet.Data) != "test" {
				t.Error("Output does not match input")
				return
			}
		}
	}()

	update.ClientMessage(websocket.ClientId{}, &websocket.Message{Topic: "test", Payload: json.RawMessage("test")})
}
