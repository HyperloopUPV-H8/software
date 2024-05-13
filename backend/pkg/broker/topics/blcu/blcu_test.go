package blcu_test

import (
	"encoding/json"
	"fmt"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/blcu"
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
	switch push.(type) {
	case blcu.DownloadRequest:
		if push.(blcu.DownloadRequest).Board != "test" {
			errorFlag = true
			return &OutputNotMatchingError{}
		}
		errorFlag = false
		log.Printf("Output matches")
		return nil
	case blcu.UploadRequest:
		if push.(blcu.UploadRequest).Board != "test" || string(push.(blcu.UploadRequest).Data) != "test" {
			errorFlag = true
			fmt.Printf("Expected board 'test' and data 'test', got board '%s' and data '%s'\n", push.(blcu.UploadRequest).Board, string(push.(blcu.UploadRequest).Data))
			return &OutputNotMatchingError{}
		}
		errorFlag = false
		log.Printf("Output matches")
		return nil
	}
	return nil
}

func (api MockAPI) UserPull(request abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
	return nil, nil
}

func TestBLCUTopic_Download_Push(t *testing.T) {
	logger := zerolog.New(os.Stdout).With().Timestamp().Logger()
	u := url.URL{Scheme: "ws", Host: "localhost:8080", Path: "/download"}
	clientChan := make(chan *websocket.Client)

	// Start HTTP server with WebSocket upgrade and echo back
	http.HandleFunc("/download", func(writer http.ResponseWriter, request *http.Request) {
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

	time.Sleep(300 * time.Millisecond)

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
	download.SetAPI(api)
	download.SetPool(pool)

	// Simulate sending a download request
	request := blcu.DownloadRequest{Board: "test"}
	err = download.Push(request)
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
		if output.Topic != blcu.DownloadName {
			t.Errorf("Expected topic %s, got %s", blcu.DownloadName, output.Topic)
		}
		if string(output.Payload) != "test" {
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

func TestBLCUTopic_Download_ClientMessage(t *testing.T) {
	download := blcu.Download{}
	download.SetAPI(&MockAPI{})

	download.ClientMessage(websocket.ClientId{0}, &websocket.Message{
		Topic:   blcu.DownloadName,
		Payload: []byte(`{"board":"test"}`),
	})

	if errorFlag {
		t.Fatal("Output does not match")
	}
}

func TestBLCUTopic_Upload_Push(t *testing.T) {
	logger := zerolog.New(os.Stdout).With().Timestamp().Logger()
	u := url.URL{Scheme: "ws", Host: "localhost:8080", Path: "/upload"}
	clientChan := make(chan *websocket.Client)

	// Start HTTP server with WebSocket upgrade and echo back
	http.HandleFunc("/upload", func(writer http.ResponseWriter, request *http.Request) {
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

	upload := blcu.Upload{}
	upload.SetAPI(api)
	upload.SetPool(pool)

	// Simulate sending a download request
	request := blcu.UploadRequest{Board: "test", Data: []byte("test")}
	err = upload.Push(request)
	if err != nil {
		t.Fatal("Error pushing upload request:", err)
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
		if output.Topic != blcu.UploadName {
			t.Errorf("Expected topic %s, got %s", blcu.UploadName, output.Topic)
		}
		if string(output.Payload) != "test" {
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

func TestBLCUTopic_Upload_ClientMessage(t *testing.T) {
	upload := blcu.Upload{}
	upload.SetAPI(&MockAPI{})

	payload := blcu.UploadRequest{Board: "test", Data: []byte("test")}
	payloadBytes, _ := json.Marshal(payload)

	upload.ClientMessage(websocket.ClientId{0}, &websocket.Message{
		Topic:   blcu.UploadName,
		Payload: payloadBytes,
	})

	if errorFlag {
		t.Fatal("Output does not match")
	}
}
