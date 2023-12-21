package websocket

import (
	"net/http"

	ws "github.com/gorilla/websocket"
)

type Upgrader struct {
	ws.Upgrader
	connections chan<- *Client
}

func (upgrader *Upgrader) ServeHTTP(writer http.ResponseWriter, request *http.Request) {
	conn, err := upgrader.Upgrade(writer, request, nil)
	if err != nil {
		return
	}

	upgrader.connections <- NewClient(conn)
}
