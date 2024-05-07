package blcu_test

import (
	"encoding/json"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
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

type MockAPI struct {
	messageChan chan abstraction.BrokerPush
}

func NewMockAPI() MockAPI {
	return MockAPI{messageChan: make(chan abstraction.BrokerPush)}
}

func (m MockAPI) UserPush(push abstraction.BrokerPush) error {
	m.messageChan <- push
	return nil
}

func (m MockAPI) UserPull(pull abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
	m.messageChan <- pull
	return nil, nil
}

type MockPacket struct {
	Message string
	Data    string
}

func (m MockPacket) Topic() abstraction.BrokerTopic {
	return "test"
}

func (m MockPacket) GetMessage() string {
	return m.Message
}

func (m MockPacket) GetData() string {
	return m.Data
}

func TestDownloadPush(t *testing.T) {
	logger := zerolog.New(os.Stdout)
	u := url.URL{Scheme: "ws", Host: "localhost:8080", Path: "/download"}

	clientChan := make(chan *websocket.Client)
	http.HandleFunc("/download", func(writer http.ResponseWriter, request *http.Request) {
		upgrader := websocket.NewUpgrader(clientChan, logger)
		upgrader.Upgrade(writer, request, nil)
	})
	go http.ListenAndServe(":8080", nil)

	c, _, err := ws.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		t.Fatal("Error dialing:", err)
	}

	api := NewMockAPI()
	pool := websocket.NewPool(clientChan, logger)

	websocket.NewClient(c)

	download := &blcu.Download{}
	download.SetPool(pool)
	download.SetAPI(api)

	go func() {
		for {
			message := <-api.messageChan
			packet := message.(MockPacket)
			if packet.GetMessage() != "test" {
				t.Error("Output does not match input")
				return
			}
		}
	}()

	err = download.Push(MockPacket{Message: "test"})

	assert.NoError(t, err)

}

func TestUploadPush(t *testing.T) {
	logger := zerolog.New(os.Stdout)
	u := url.URL{Scheme: "ws", Host: "localhost:8080", Path: "/upload"}

	clientChan := make(chan *websocket.Client)
	http.HandleFunc("/upload", func(writer http.ResponseWriter, request *http.Request) {
		upgrader := websocket.NewUpgrader(clientChan, logger)
		upgrader.Upgrade(writer, request, nil)
	})
	go http.ListenAndServe(":8080", nil)

	c, _, err := ws.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		t.Fatal("Error dialing:", err)
	}

	api := NewMockAPI()
	pool := websocket.NewPool(clientChan, logger)

	websocket.NewClient(c)

	upload := &blcu.Upload{}
	upload.SetPool(pool)
	upload.SetAPI(api)

	go func() {
		for {
			message := <-api.messageChan
			packet := message.(MockPacket)
			if packet.GetMessage() != "test" || packet.GetData() != "test" {
				t.Error("Output does not match input")
				return
			}
		}
	}()

	err = upload.Push(blcu.UploadRequest{Board: "test", Data: []byte("test")})

	assert.NoError(t, err)
}

func TestClientMessage(t *testing.T) {
	logger := zerolog.New(os.Stdout)
	u := url.URL{Scheme: "ws", Host: "localhost:8080", Path: "/blcucm"}

	clientChan := make(chan *websocket.Client)
	http.HandleFunc("/blcucm", func(writer http.ResponseWriter, request *http.Request) {
		upgrader := websocket.NewUpgrader(clientChan, logger)
		upgrader.Upgrade(writer, request, nil)
	})
	go http.ListenAndServe(":8080", nil)

	c, _, err := ws.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		t.Fatal("Error dialing:", err)
	}

	api := NewMockAPI()
	pool := websocket.NewPool(clientChan, logger)

	websocket.NewClient(c)

	upload := &blcu.Upload{}
	upload.SetPool(pool)
	upload.SetAPI(api)

	go func() {
		for {
			message := <-api.messageChan
			packet := message.(blcu.UploadRequest)
			if packet.Board != "test" || string(packet.Data) != "test" {
				t.Error("Output does not match input")
				return
			}
		}
	}()

	packet := blcu.UploadRequest{Board: "test", Data: []byte("test")}
	encodedPackage, _ := json.Marshal(packet)

	upload.ClientMessage(websocket.ClientId{}, &websocket.Message{Topic: blcu.UploadName, Payload: encodedPackage})
}
