package ws_handle

import (
	"encoding/json"
	"sync"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/internal/ws_handle/models"
	"github.com/gorilla/websocket"
	"github.com/rs/zerolog"
	trace "github.com/rs/zerolog/log"
)

type WebSocketBroker struct {
	handlersMx *sync.Mutex
	handlers   map[string][]models.MessageHandler
	clientsMx  *sync.Mutex
	clients    map[string]models.Client
	trace      zerolog.Logger
}

func New() WebSocketBroker {
	trace.Info().Msg("new websocket broker")
	return WebSocketBroker{
		handlersMx: &sync.Mutex{},
		handlers:   make(map[string][]models.MessageHandler),
		clientsMx:  &sync.Mutex{},
		clients:    make(map[string]models.Client),
		trace:      trace.With().Str("component", "webSocketBroker").Logger(),
	}
}

func (broker *WebSocketBroker) Add(conn *websocket.Conn) error {
	broker.clientsMx.Lock()
	defer broker.clientsMx.Unlock()
	client := models.NewClient(conn)
	broker.clients[client.Id()] = client
	go broker.readMessages(client)
	go broker.ping(client)
	return nil
}

func (broker *WebSocketBroker) readMessages(client models.Client) {
	broker.trace.Debug().Str("id", client.Id()).Msg("read messages")
	for {
		b, err := client.Read()

		if err != nil {
			broker.trace.Error().Err(err).Msg("reading message")
			broker.removeClient(client.Id())
			return
		}

		var msg models.Message
		err = json.Unmarshal(b, &msg)

		if err != nil {
			broker.trace.Error().Err(err).Msg("unmarshaling message")
			continue
		}

		broker.updateHandlers(client, msg)
	}
}

func (broker *WebSocketBroker) ping(client models.Client) {
	ticker := time.NewTicker(time.Second * 5)
	for range ticker.C {
		broker.clientsMx.Lock()
		if err := client.Ping(); err != nil {
			broker.unsafeRemoveClient(client.Id())
			broker.clientsMx.Unlock()
			return
		}
		broker.clientsMx.Unlock()
	}
}

func (broker *WebSocketBroker) updateHandlers(client models.Client, msg models.Message) {
	broker.handlersMx.Lock()
	defer broker.handlersMx.Unlock()

	broker.trace.Trace().Str("topic", msg.Topic).Str("clientId", client.Id()).Msg("update")
	for _, handler := range broker.handlers[msg.Topic] {
		handler.UpdateMessage(client, msg)
	}
}

func (broker *WebSocketBroker) RegisterHandle(handler models.MessageHandler, topics ...string) {
	broker.handlersMx.Lock()
	defer broker.handlersMx.Unlock()
	broker.trace.Debug().Strs("topics", topics).Str("handler", handler.HandlerName()).Msg("register handle")
	for _, topic := range topics {
		broker.handlers[topic] = append(broker.handlers[topic], handler)
	}
}

func (broker *WebSocketBroker) RemoveHandler(topic string, handlerName string) {
	broker.handlersMx.Lock()
	defer broker.handlersMx.Unlock()
	broker.trace.Debug().Str("topic", topic).Str("handler", handlerName).Msg("remove handler")
	for i, handler := range broker.handlers[topic] {
		if handler.HandlerName() == handlerName {
			broker.handlers[topic][i] = broker.handlers[topic][len(broker.handlers[topic])-1]
			broker.handlers[topic] = broker.handlers[topic][:len(broker.handlers[topic])-1]
			return
		}
	}
}

func (broker *WebSocketBroker) Close() error {
	broker.clientsMx.Lock()
	defer broker.clientsMx.Unlock()
	broker.trace.Info().Msg("close")
	var err error
	for id, client := range broker.clients {
		if closeErr := client.Close(); closeErr != nil {
			broker.trace.Error().Stack().Err(closeErr).Msg("")
			err = closeErr
			continue
		}
		delete(broker.clients, id)
	}

	return err
}

func (broker *WebSocketBroker) removeClient(id string) {
	broker.clientsMx.Lock()
	defer broker.clientsMx.Unlock()
	broker.unsafeRemoveClient(id)

}

func (broker *WebSocketBroker) unsafeRemoveClient(id string) {
	_, ok := broker.clients[id]

	if !ok {
		broker.trace.Warn().Str("clientId", id).Msg("client to be removed not found")
		return
	}

	delete(broker.clients, id)
	broker.trace.Error().Str("clientId", id).Msg("remove client")
}
