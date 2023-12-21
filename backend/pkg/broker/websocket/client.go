package websocket

import (
	"encoding/json"
	"sync"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	ws "github.com/gorilla/websocket"
)

type Client struct {
	readMx  *sync.Mutex
	writeMx *sync.Mutex
	conn    *ws.Conn
	onClose func()
}

func NewClient(conn *ws.Conn) *Client {
	client := &Client{
		readMx:  &sync.Mutex{},
		writeMx: &sync.Mutex{},
		conn:    conn,
		onClose: func() {},
	}

	return client
}

func (client *Client) SetOnClose(onClose func()) {
	client.onClose = onClose
}

type ClientMessage struct {
	Topic   abstraction.BrokerTopic `json:"topic"`
	Payload json.RawMessage         `json:"payload"`
}

func (client *Client) Read() (ClientMessage, error) {
	client.readMx.Lock()
	defer client.readMx.Unlock()

	var message ClientMessage
	err := client.conn.ReadJSON(&message)
	return message, err
}

func (client *Client) Write(message ClientMessage) error {
	client.writeMx.Lock()
	defer client.writeMx.Unlock()

	return client.conn.WriteJSON(message)
}

func (client *Client) Close() error {
	client.writeMx.Lock()
	defer client.writeMx.Unlock()
	client.conn.WriteControl(
		ws.CloseMessage,
		ws.FormatCloseMessage(ws.CloseNormalClosure, ""),
		time.Now().Add(time.Second*5),
	)
	client.onClose()
	return client.conn.Close()
}
