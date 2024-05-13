package data_test

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	data "github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/logger"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
	"log"
	"testing"
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

func TestLoggerTopic_ClientMessage(t *testing.T) {
	errorFlag = true
	loggerTopic := data.NewEnableTopic()
	loggerTopic.SetAPI(&MockAPI{})

	loggerTopic.ClientMessage(websocket.ClientId{0}, &websocket.Message{
		Topic:   data.EnableName,
		Payload: []byte("true"),
	})

	if errorFlag {
		t.Fatal("Output does not match")
	}
}
