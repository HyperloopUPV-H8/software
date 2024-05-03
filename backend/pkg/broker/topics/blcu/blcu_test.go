package blcu_test

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/blcu"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
	ws "github.com/gorilla/websocket"
	"github.com/rs/zerolog"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/url"
	"os"
	"testing"
)

func TestDownloadPush(t *testing.T) {
	logger := zerolog.New(os.Stdout)
	u := url.URL{Scheme: "ws", Host: "localhost:8080", Path: "/ws"}

	clientChan := make(chan *websocket.Client)
	http.HandleFunc("/ws", func(writer http.ResponseWriter, request *http.Request) {
		upgrader := websocket.NewUpgrader(clientChan, logger)
		upgrader.Upgrade(writer, request, nil)
	})

	go http.ListenAndServe(":8080", nil)
	c, _, err := ws.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		t.Fatal("Error dialing:", err)
	}

	api := broker.New(logger)
	pool := websocket.NewPool(make(chan *websocket.Client), logger)

	websocket.NewClient(c)

	download := &blcu.Download{}
	download.SetPool(pool)
	download.SetAPI(api)

	err = download.Push(blcu.DownloadRequest{Board: "test"})

	assert.NoError(t, err)
}
