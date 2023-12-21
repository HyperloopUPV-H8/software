package websocket

import "github.com/google/uuid"

type ClientId uuid.UUID

type Handler struct {
	clients     map[ClientId]*Client
	connections <-chan *Client
	onMessage   func(ClientId, ClientMessage)
}

func NewHandler(connections <-chan *Client) *Handler {
	handler := &Handler{
		clients:     make(map[ClientId]*Client),
		connections: connections,
	}

	go handler.listen()

	return handler
}

func (handler *Handler) listen() {
	for client := range handler.connections {
		id := ClientId(uuid.New())
		handler.clients[id] = client
		go handler.handle(id, client)
		client.SetOnClose(handler.onClose(id))
	}
}

func (handler *Handler) handle(id ClientId, client *Client) {
	for {
		message, err := client.Read()
		if err != nil {
			return
		}

		handler.onMessage(id, message)
	}
}

func (handler *Handler) Write(id ClientId, message ClientMessage) error {
	client, ok := handler.clients[id]
	if !ok {
		return ErrClientNotFound{Id: id}
	}

	return client.Write(message)
}

func (handler *Handler) Broadcast(message ClientMessage) {
	for id := range handler.clients {
		handler.Write(id, message)
	}
}

func (handler *Handler) onClose(id ClientId) func() {
	return func() {
		delete(handler.clients, id)
	}
}
