package data_test

import (
	"encoding/json"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker"
	data "github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/connection"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
	ws "github.com/gorilla/websocket"
	"github.com/rs/zerolog"
	"net/http"
	"net/url"
	"os"
	"testing"
	"time"
)

func TestConnectionTopic_Push(t *testing.T) {
	logger := zerolog.New(os.Stdout).With().Timestamp().Logger()
	u := url.URL{Scheme: "ws", Host: "localhost:8080", Path: "/connection"}
	clientChan := make(chan *websocket.Client)

	// Start HTTP server with WebSocket upgrade and echo back
	http.HandleFunc("/connection", func(writer http.ResponseWriter, request *http.Request) {
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
				_, msg, readMsgErr := conn.ReadMessage()
				if readMsgErr != nil {
					logger.Error().Err(readMsgErr).Msg("Read error")
					return
				}
				readMsgErr = conn.WriteMessage(ws.TextMessage, msg)
				if readMsgErr != nil {
					logger.Error().Err(readMsgErr).Msg("Write error")
					return
				}
			}
		}()
	})

	go http.ListenAndServe(":8080", nil)

	// Set up the client
	c, _, clientErr := ws.DefaultDialer.Dial(u.String(), nil)
	if clientErr != nil {
		logger.Fatal().Err(clientErr).Msg("Error dialing")
	}
	defer c.Close()
	defer logger.Info().Str("id", "client").Msg("Client connection closed")

	api := broker.New(logger)
	pool := websocket.NewPool(clientChan, logger)
	client := websocket.NewClient(c)
	clientChan <- client

	update := data.NewUpdateTopic()
	update.SetAPI(api)
	update.SetPool(pool)

	// Simulate sending a download request
	request := data.NewConnection("test", true)
	pushErr := update.Push(request)
	if pushErr != nil {
		t.Fatal("Error pushing:", pushErr)
	}

	// Use a timeout for client read
	done := make(chan bool)
	go func() {
		output, readErr := client.Read()
		if readErr != nil {
			logger.Error().Err(readErr).Msg("Client read failed")
			done <- true
			return
		}
		if output.Topic != data.UpdateName {
			t.Errorf("Expected topic %s, got %s", data.UpdateName, output.Topic)
		}

		payload := data.Connection{Name: "test", IsConnected: true}
		payloadBytes, _ := json.Marshal(payload)

		if string(output.Payload) != string(payloadBytes) {
			t.Error("Expected payload 'test', got", string(output.Payload))
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

func TestConnectionTopic_ClientMessage(t *testing.T) {
	logger := zerolog.New(os.Stdout).With().Timestamp().Logger()
	u := url.URL{Scheme: "ws", Host: "localhost:8080", Path: "/connectioncm"}
	clientChan := make(chan *websocket.Client)

	// Start HTTP server with WebSocket upgrade and echo back
	http.HandleFunc("/connectioncm", func(writer http.ResponseWriter, request *http.Request) {
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
				_, msg, readMsgErr := conn.ReadMessage()
				if readMsgErr != nil {
					logger.Error().Err(readMsgErr).Msg("Read error")
					return
				}
				readMsgErr = conn.WriteMessage(ws.TextMessage, msg)
				if readMsgErr != nil {
					logger.Error().Err(readMsgErr).Msg("Write error")
					return
				}
			}
		}()
	})

	go http.ListenAndServe(":8080", nil)

	// Set up the client
	c, _, clientErr := ws.DefaultDialer.Dial(u.String(), nil)
	if clientErr != nil {
		logger.Fatal().Err(clientErr).Msg("Error dialing")
	}
	defer c.Close()
	defer logger.Info().Str("id", "client").Msg("Client connection closed")

	api := broker.New(logger)
	pool := websocket.NewPool(clientChan, logger)
	client := websocket.NewClient(c)
	clientChan <- client

	update := data.NewUpdateTopic()
	update.SetAPI(api)
	update.SetPool(pool)

	// Simulate sending a subscribe request
	payloadInput := &map[string]data.Connection{
		"test": {Name: "test", IsConnected: true},
	}
	rawPayloadInput, _ := json.Marshal(payloadInput)

	update.ClientMessage(websocket.ClientId{0}, &websocket.Message{
		Topic:   data.SubscribeName,
		Payload: rawPayloadInput,
	})

	// Use a timeout for client read
	done := make(chan bool)
	go func() {
		output, readErr := client.Read()
		if readErr != nil {
			logger.Error().Err(readErr).Msg("Client read failed")
			done <- true
			return
		}
		if output.Topic != data.SubscribeName {
			t.Errorf("Expected topic %s, got %s", data.SubscribeName, output.Topic)
		}

		payloadOutput := data.Connection{Name: "test", IsConnected: true}
		payloadBytesOutput, _ := json.Marshal(payloadOutput)

		if string(output.Payload) != string(payloadBytesOutput) {
			comparison, _ := json.Marshal(payloadInput)
			t.Errorf("Expected payload %s , got %s", string(comparison), string(output.Payload))
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
