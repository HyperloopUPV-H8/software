package data_test

import (
	"encoding/json"
	"github.com/HyperloopUPV-H8/h9-backend/internal/update_factory/models"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/data"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
	ws "github.com/gorilla/websocket"
	"github.com/rs/zerolog"
	"net/http"
	"net/url"
	"os"
	"testing"
	"time"
)

func TestDataTopic_Push(t *testing.T) {
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

	time.Sleep(100 * time.Millisecond)

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

	dataTopic := data.NewUpdateTopic(1 * time.Millisecond)
	dataTopic.SetAPI(api)
	dataTopic.SetPool(pool)

	// Simulate sending a download request

	request := data.NewPush(&models.Update{
		Id:        1,
		HexValue:  "test",
		Count:     1,
		CycleTime: 1,
		Values: map[string]models.UpdateValue{
			"test": &models.NumericValue{
				Value:   1.0,
				Average: 1.0,
			},
		},
	})
	pushErr := dataTopic.Push(request)
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

		payload := data.NewPush(&models.Update{
			Id:        1,
			HexValue:  "test",
			Count:     1,
			CycleTime: 1,
			Values: map[string]models.UpdateValue{
				"test": &models.NumericValue{
					Value:   1.0,
					Average: 1.0,
				},
			},
		})
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
