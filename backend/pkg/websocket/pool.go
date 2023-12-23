package websocket

import "github.com/google/uuid"

type ClientId uuid.UUID

type Pool struct {
	clients     map[ClientId]*Client
	connections <-chan *Client
	onMessage   func(ClientId, ClientMessage)
}

func NewPool(connections <-chan *Client) *Pool {
	handler := &Pool{
		clients:     make(map[ClientId]*Client),
		connections: connections,
		onMessage:   func(ClientId, ClientMessage) {},
	}

	go handler.listen()

	return handler
}

func (pool *Pool) SetOnMessage(onMessage func(ClientId, ClientMessage)) {
	pool.onMessage = onMessage
}

func (pool *Pool) listen() {
	for client := range pool.connections {
		id := ClientId(uuid.New())
		pool.clients[id] = client
		go pool.handle(id, client)
		client.SetOnClose(pool.onClose(id))
	}
}

func (pool *Pool) handle(id ClientId, client *Client) {
	defer client.Close()
	for {
		message, err := client.Read()
		if err != nil {
			return
		}

		pool.onMessage(id, message)
	}
}

func (pool *Pool) Write(id ClientId, message ClientMessage) error {
	client, ok := pool.clients[id]
	if !ok {
		return ErrClientNotFound{Id: id}
	}

	return client.Write(message)
}

func (pool *Pool) Broadcast(message ClientMessage) {
	for id := range pool.clients {
		pool.Write(id, message)
	}
}

func (pool *Pool) onClose(id ClientId) func() {
	return func() {
		delete(pool.clients, id)
	}
}

func (pool *Pool) Close() error {
	for _, client := range pool.clients {
		client.Close()
	}

	return nil
}
