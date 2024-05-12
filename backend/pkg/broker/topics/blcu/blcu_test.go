package blcu_test

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/blcu"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
	ws "github.com/gorilla/websocket"
	"github.com/rs/zerolog"
	"net/http"
	"net/url"
	"os"
	"testing"
	"time"
)

func TestDownload(t *testing.T) {
	logger := zerolog.New(os.Stdout).With().Timestamp().Logger()
	u := url.URL{Scheme: "ws", Host: "localhost:8080", Path: "/download"}
	clientChan := make(chan *websocket.Client)

	// Start HTTP server with WebSocket upgrade and echo back
	http.HandleFunc("/download", func(writer http.ResponseWriter, request *http.Request) {
		upgrader := ws.Upgrader{
			CheckOrigin: func(r *http.Request) bool { return true },
		}
		conn, err := upgrader.Upgrade(writer, request, nil)
		if err != nil {
			logger.Error().Err(err).Msg("Failed to upgrade")
			return
		}
		defer conn.Close()
		defer logger.Info().Str("id", "server").Msg("Connection closed")

		// Handle and echo messages continuously
		go func() {
			for {
				_, msg, err := conn.ReadMessage()
				if err != nil {
					logger.Error().Err(err).Msg("Read error")
					return
				}
				err = conn.WriteMessage(ws.TextMessage, msg)
				if err != nil {
					logger.Error().Err(err).Msg("Write error")
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

	download := blcu.Download{}
	download.SetPool(pool)
	download.SetAPI(api)

	// Simulate sending a download request
	request := blcu.DownloadRequest{Board: "test"}
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
		if output.Topic != "blcu/downloadRequest" {
			t.Error("Expected topic blcu/downloadRequest, got", output.Topic)
		}
		if string(output.Payload) != "test" {
			t.Error("Expected payload test, got", string(output.Payload))
		}
		done <- true
	}()

	select {
	case <-done:
		logger.Info().Msg("Test completed successfully")
	case <-time.After(10 * time.Second):
		t.Error("Test timed out")
	}
}
