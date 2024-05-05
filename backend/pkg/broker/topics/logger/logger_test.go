package data_test

import (
	"encoding/json"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker"
	data "github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/logger"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
	ws "github.com/gorilla/websocket"
	"github.com/rs/zerolog"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/url"
	"os"
	"testing"
)

func TestLoggerEnable(t *testing.T) {
	logger := zerolog.New(os.Stdout)
	u := url.URL{Scheme: "ws", Host: "localhost:8080", Path: "/logger"}

	clientChan := make(chan *websocket.Client)
	http.HandleFunc("/logger", func(writer http.ResponseWriter, request *http.Request) {
		upgrader := websocket.NewUpgrader(clientChan, logger)
		upgrader.Upgrade(writer, request, nil)
	})
	go http.ListenAndServe(":8080", nil)

	c, _, err := ws.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		t.Fatal("Error dialing:", err)
	}

	api := broker.New(logger)
	pool := websocket.NewPool(clientChan, logger)

	websocket.NewClient(c)

	log := data.NewEnableTopic()
	log.SetPool(pool)
	log.SetAPI(api)

	err = log.Push(data.NewStatus(true))

	assert.NoError(t, err)
}

func TestClientMessage(t *testing.T) {
	logger := zerolog.New(os.Stdout)
	u := url.URL{Scheme: "ws", Host: "localhost:8080", Path: "/loggercm"}

	clientChan := make(chan *websocket.Client)
	http.HandleFunc("/loggercm", func(writer http.ResponseWriter, request *http.Request) {
		upgrader := websocket.NewUpgrader(clientChan, logger)
		upgrader.Upgrade(writer, request, nil)
	})
	go http.ListenAndServe(":8080", nil)

	c, _, err := ws.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		t.Fatal("Error dialing:", err)
	}

	api := broker.New(logger)
	pool := websocket.NewPool(clientChan, logger)

	websocket.NewClient(c)

	log := data.NewEnableTopic()
	log.SetPool(pool)
	log.SetAPI(api)

	log.ClientMessage(websocket.ClientId{}, &websocket.Message{"test", json.RawMessage("test")})
}
