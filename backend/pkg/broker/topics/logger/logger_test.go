package data_test

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker"
	data "github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/logger"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
	ws "github.com/gorilla/websocket"
	"github.com/rs/zerolog"
	"log"
	"net/http"
	"net/url"
	"os"
	"testing"
	"time"
)

var errorFlag bool

type OutputNotMatchingError struct{}

func (e *OutputNotMatchingError) Error() string {
	return "Output does not match"
}

type MockAPI struct{}

func (api MockAPI) UserPush(push abstraction.BrokerPush) error {
	if !push.(*data.Status).Enable() {
		errorFlag = true
		return &OutputNotMatchingError{}
	}
	errorFlag = false
	log.Printf("Output matches")
	return nil
}

func (api MockAPI) UserPull(request abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
	return nil, nil
}

func TestLoggerTopic_Push(t *testing.T) {
	logger := zerolog.New(os.Stdout).With().Timestamp().Logger()
	u := url.URL{Scheme: "ws", Host: "localhost:8080", Path: "/data"}
	clientChan := make(chan *websocket.Client)

	// Start HTTP server with WebSocket upgrade and echo back
	http.HandleFunc("/data", func(writer http.ResponseWriter, request *http.Request) {
		upgrader := ws.Upgrader{
			CheckOrigin: func(r *http.Request) bool { return true },
		}
		conn, upgradeErr := upgrader.Upgrade(writer, request, nil)
		if upgradeErr != nil {
			logger.Error().Err(upgradeErr).Msg("Failed to upgrade")
			return
		}
		defer conn.Close()
		defer logger.Info().Str("id", "server").Msg("Connection closed")

		// Handle and echo messages continuously
		go func() {
			for {
				_, msg, readMsgRead := conn.ReadMessage()
				if readMsgRead != nil {
					logger.Error().Err(readMsgRead).Msg("Read error")
					return
				}
				writeMsgErr := conn.WriteMessage(ws.TextMessage, msg)
				if writeMsgErr != nil {
					logger.Error().Err(writeMsgErr).Msg("Write error")
					return
				}
			}
		}()
	})

	go http.ListenAndServe(":8080", nil)

	time.Sleep(100 * time.Millisecond)

	// Set up the client
	c, _, err := ws.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		logger.Fatal().Err(err).Msg("Error dialing")
	}
	defer c.Close()
	defer logger.Info().Str("id", "client").Msg("Client connection closed")

	api := broker.New(logger)
	pool := websocket.NewPool(clientChan, logger)
	client := websocket.NewClient(c)
	clientChan <- client

	download := data.NewEnableTopic()
	download.SetAPI(api)
	download.SetPool(pool)

	// Simulate sending a download request
	request := data.NewStatus(true)
	err = download.Push(request)
	if err != nil {
		t.Fatal("Error pushing download request:", err)
	}

	// Use a timeout for client read
	done := make(chan bool)
	go func() {
		output, err := client.Read()
		if err != nil {
			logger.Error().Err(err).Msg("Client read failed")
			done <- true
			return
		}
		if output.Topic != data.EnableName {
			t.Errorf("Expected topic %s, got %s", data.EnableName, output.Topic)
		}
		if string(output.Payload) != "true" {
			t.Error("Expected payload 'true', got", string(output.Payload))
		}
		done <- true
	}()

	select {
	case <-done:
		logger.Info().Msg("Test completed successfully")
	case <-time.After(3 * time.Second):
		t.Error("Test timed out")
	}
}

func TestDownload_ClientMessage(t *testing.T) {
	errorFlag = true
	loggerTopic := data.NewEnableTopic()
	loggerTopic.SetAPI(&MockAPI{})

	loggerTopic.ClientMessage(websocket.ClientId{0}, &websocket.Message{
		Topic:   data.EnableName,
		Payload: []byte("true"),
	})

	time.Sleep(100 * time.Millisecond)

	if errorFlag {
		t.Fatal("Output does not match")
	}
}
