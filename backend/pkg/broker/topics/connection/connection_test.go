package data_test

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker"
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

	api := broker.New(logger)
	pool := websocket.NewPool(clientChan, logger)

	websocket.NewClient(c)

	update := data.NewUpdateTopic()
	update.SetPool(pool)
	update.SetAPI(api)

	err = update.Push(data.NewConnection("test", true))

	assert.NoError(t, err)
}
