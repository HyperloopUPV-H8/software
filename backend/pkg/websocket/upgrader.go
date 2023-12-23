package websocket

import (
	"fmt"
	"net/http"

	ws "github.com/gorilla/websocket"
)

type Upgrader struct {
	ws.Upgrader
	connections chan<- *Client
}

func (upgrader *Upgrader) ServeHTTP(writer http.ResponseWriter, request *http.Request) {
	defer request.Body.Close()
	conn, err := upgrader.Upgrade(writer, request, nil)
	if err != nil {
		fmt.Printf("connection upgrade error: %s\n", err) // TODO: better error logging
		return
	}

	upgrader.connections <- NewClient(conn)
}
