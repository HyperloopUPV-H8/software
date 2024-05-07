package data_test

import (
	"encoding/json"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/blcu"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/connection"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
	ws "github.com/gorilla/websocket"
	"github.com/rs/zerolog"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/url"
	"os"
	"testing"
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

func TestUpdate_Push(t *testing.T) {
	logger := zerolog.New(os.Stdout)
	u := url.URL{Scheme: "ws", Host: "localhost:8080", Path: "/update"}

	clientChan := make(chan *websocket.Client)
	http.HandleFunc("/update", func(writer http.ResponseWriter, request *http.Request) {
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

	update := data.NewUpdateTopic()
	update.SetPool(pool)
	update.SetAPI(api)

	go func() {
		for {
			message := <-api.messageChan
			packet := message.(*data.Connection)
			if packet.Name != "test" || packet.IsConnected != true {
				t.Error("Output does not match input")
				return
			}
		}
	}()
	err = update.Push(data.NewConnection("test", true))

	assert.NoError(t, err)
}

func TestClientMessage(t *testing.T) {
	logger := zerolog.New(os.Stdout)
	u := url.URL{Scheme: "ws", Host: "localhost:8080", Path: "/connectioncm"}

	clientChan := make(chan *websocket.Client)
	http.HandleFunc("/connectioncm", func(writer http.ResponseWriter, request *http.Request) {
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

	update := data.NewUpdateTopic()
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
