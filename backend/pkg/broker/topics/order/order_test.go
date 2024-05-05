package order_test

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/order"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
	ws "github.com/gorilla/websocket"
	"github.com/rs/zerolog"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/url"
	"os"
	"testing"
)

func TestOrderSend(t *testing.T) {
	logger := zerolog.New(os.Stdout)
	u := url.URL{Scheme: "ws", Host: "localhost:8080", Path: "/send"}

	clientChan := make(chan *websocket.Client)
	http.HandleFunc("/send", func(writer http.ResponseWriter, request *http.Request) {
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

	send := order.NewSendTopic()
	send.SetPool(pool)
	send.SetAPI(api)

	err = send.Push(&order.Order{
		Id:     0,
		Fields: make(map[string]order.Field),
	})

	assert.NoError(t, err)
}

func TestOrderState(t *testing.T) {
	logger := zerolog.New(os.Stdout)
	u := url.URL{Scheme: "ws", Host: "localhost:8080", Path: "/state"}

	clientChan := make(chan *websocket.Client)
	http.HandleFunc("/state", func(writer http.ResponseWriter, request *http.Request) {
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

	state := &order.State{}
	state.SetPool(pool)
	state.SetAPI(api)
}
