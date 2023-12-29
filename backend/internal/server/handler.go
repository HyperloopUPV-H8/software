package server

import (
	"fmt"
	"sync"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
)

type Handler struct {
	config   Config
	serverMx *sync.Mutex
	servers  map[string]*WebServer
}

func New(upgrader *websocket.Upgrader, data EndpointData, config Config) (*Handler, error) {
	handler := &Handler{
		config:   config,
		serverMx: &sync.Mutex{},
		servers:  make(map[string]*WebServer, len(config)),
	}

	for name, serverConfig := range config {
		server, err := NewWebServer(name, upgrader, data, serverConfig)
		if err != nil {
			return nil, err
		}

		handler.AddWebServer(name, server)
	}

	return handler, nil
}

func (handler *Handler) AddWebServer(name string, server *WebServer) error {
	handler.serverMx.Lock()
	defer handler.serverMx.Unlock()

	if _, ok := handler.servers[name]; ok {
		return fmt.Errorf("server %s already exists", name)
	}

	handler.servers[name] = server
	return nil
}

func (handler *Handler) ListenAndServe() <-chan error {
	errs := make(chan error, len(handler.servers))

	for name := range handler.servers {
		go handler.consumeErrors(name, handler.servers[name].ListenAndServe(), errs)
	}

	return errs
}

func (handler *Handler) consumeErrors(name string, serverErrs <-chan error, errs chan<- error) {
	for err := range serverErrs {
		errs <- err
		handler.RemoveServer(name)
	}
}

func (handler *Handler) RemoveServer(name string) {
	handler.serverMx.Lock()
	defer handler.serverMx.Unlock()

	delete(handler.servers, name)
}
