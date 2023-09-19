package models

import (
	"sync"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type Client struct {
	id string

	conn    *websocket.Conn //FIXME: why pointer?
	readMx  *sync.Mutex
	writeMx *sync.Mutex
}

func (c *Client) Id() string {
	return c.id
}

func (c *Client) Read() ([]byte, error) {
	c.readMx.Lock()
	defer c.readMx.Unlock()
	_, p, err := c.conn.ReadMessage()
	return p, err
}

func (c *Client) Write(b []byte) error {
	c.writeMx.Lock()
	defer c.writeMx.Unlock()
	return c.conn.WriteMessage(websocket.TextMessage, b)
}

func (c *Client) Ping() error {
	c.writeMx.Lock()
	defer c.writeMx.Unlock()
	return c.conn.WriteMessage(websocket.PingMessage, []byte{})
}

func (c *Client) Close() error {
	return c.conn.Close()
}

func NewClient(conn *websocket.Conn) Client {
	return Client{
		id: uuid.NewString(), //TODO: CAN PANIC

		conn:    conn,
		writeMx: &sync.Mutex{},
		readMx:  &sync.Mutex{},
	}
}
