package websocket

import (
	"encoding/json"
	"sync"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	ws "github.com/gorilla/websocket"
)

type Client struct {
	readMx    *sync.Mutex
	writeMx   *sync.Mutex
	conn      *ws.Conn
	onCloseMx *sync.Mutex
	onClose   func()
}

func NewClient(conn *ws.Conn) *Client {
	client := &Client{
		readMx:    &sync.Mutex{},
		writeMx:   &sync.Mutex{},
		conn:      conn,
		onCloseMx: &sync.Mutex{},
		onClose:   func() {},
	}

	return client
}

func (client *Client) SetOnClose(onClose func()) {
	client.onCloseMx.Lock()
	defer client.onCloseMx.Unlock()
	client.onClose = onClose
}

type Message struct {
	Topic   abstraction.BrokerTopic `json:"topic"`
	Payload json.RawMessage         `json:"payload"`
}

func (client *Client) Read() (Message, error) {
	client.readMx.Lock()
	defer client.readMx.Unlock()

	var message Message
	err := client.conn.ReadJSON(&message)
	return message, err
}

func (client *Client) Write(message Message) error {
	client.writeMx.Lock()
	defer client.writeMx.Unlock()

	return client.conn.WriteJSON(message)
}

func (client *Client) Close(code int, reason string) error {
	client.writeMx.Lock()
	defer client.writeMx.Unlock()
	client.conn.WriteControl(
		ws.CloseMessage,
		ws.FormatCloseMessage(code, reason),
		time.Now().Add(time.Second),
	)
	client.onCloseMx.Lock()
	defer client.onCloseMx.Unlock()
	client.onClose()
	return client.conn.Close()
}
