package data_test

import (
	"encoding/json"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker"
	data "github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/message"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/packet/protection"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
	ws "github.com/gorilla/websocket"
	"github.com/rs/zerolog"
	"net/http"
	"net/url"
	"os"
	"testing"
	"time"
)

func TestMessageTopic_Push(t *testing.T) {
	logger := zerolog.New(os.Stdout).With().Timestamp().Logger()
	u := url.URL{Scheme: "ws", Host: "localhost:8080", Path: "/message"}
	clientChan := make(chan *websocket.Client)

	// Start HTTP server with WebSocket upgrade and echo back
	http.HandleFunc("/message", func(writer http.ResponseWriter, request *http.Request) {
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

	messageTopic := data.NewUpdateTopic(map[abstraction.BoardId]string{})
	messageTopic.SetAPI(api)
	messageTopic.SetPool(pool)

	// Simulate sending a download request
	request := data.Push("test", 0)
	err = messageTopic.Push(request)
	if err != nil {
		t.Fatal("Error pushing download request:", err)
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

		comparison := map[abstraction.BoardId]string{
			0: "test",
		}
		comparisonBytes, _ := json.Marshal(comparison)
		if string(output.Payload) != string(comparisonBytes) {
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

func TestMessageTopic_ClientMessage(t *testing.T) {
	logger := zerolog.New(os.Stdout).With().Timestamp().Logger()
	api := broker.New(logger)

	messageTopic := data.NewUpdateTopic(map[abstraction.BoardId]string{})
	messageTopic.SetAPI(api)

	packet := protection.NewPacket(0, protection.Ok)
	payload := data.Push(packet, 0)
	payloadBytes, _ := json.Marshal(payload)
	messageTopic.ClientMessage(websocket.ClientId{0}, &websocket.Message{
		Topic:   data.SubscribeName,
		Payload: payloadBytes,
	})
}
