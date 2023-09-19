package logger_handler

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"time"

	wsModels "github.com/HyperloopUPV-H8/h9-backend/internal/ws_handle/models"

	"github.com/rs/zerolog"
	trace "github.com/rs/zerolog/log"
)

const (
	LogHandlerHandlerName = "LoggerHandler"
	ResponseTopic         = "logger/response"
)

type LoggerHandler struct {
	loggers       map[string]Logger
	loggableChan  chan Loggable
	currentClient *wsModels.Client
	isRunning     bool
	isRunningMx   *sync.Mutex
	config        Config
	trace         zerolog.Logger
}

func NewLoggerHandler(loggers map[string]Logger, config Config) LoggerHandler {
	trace.Info().Msg("new LoggerHandler")

	os.MkdirAll(config.BasePath, 0777)
	os.Chmod(config.BasePath, 0777)

	return LoggerHandler{
		loggers:       loggers,
		loggableChan:  make(chan Loggable),
		currentClient: nil,
		isRunning:     false,
		isRunningMx:   &sync.Mutex{},

		config: config,
		trace:  trace.With().Str("component", LogHandlerHandlerName).Logger(),
	}
}

func (handler *LoggerHandler) Log(loggable Loggable) {
	handler.isRunningMx.Lock()
	if handler.isRunning {
		handler.loggableChan <- loggable
	}
	handler.isRunningMx.Unlock()
}

func (handler *LoggerHandler) UpdateMessage(client wsModels.Client, msg wsModels.Message) {
	handler.trace.Info().Str("topic", msg.Topic).Str("client", client.Id()).Msg("update message")
	switch msg.Topic {
	case handler.config.Topics.Enable:
		var enable bool
		err := json.Unmarshal(msg.Payload, &enable)
		if err != nil {
			handler.trace.Error().Stack().Err(err).Msg("unmarshal enable")
			return
		}

		handler.handleEnable(enable, client)
	}

}

func (handler *LoggerHandler) handleEnable(enable bool, client wsModels.Client) error {
	if !handler.verifySession(client) {
		handler.trace.Warn().Str("source", client.Id()).Msg("tried to change running log session")
		return fmt.Errorf("%s tried to change running log session of %s", client.Id(), handler.currentClient.Id())
	}

	handler.changeState(enable)

	return nil
}

func (handler *LoggerHandler) changeState(enable bool) {
	handler.isRunningMx.Lock()
	defer handler.isRunningMx.Unlock()
	if enable && !handler.isRunning {
		handler.start()
	} else if !enable && handler.isRunning {
		handler.stop()
	}
}

func (handler *LoggerHandler) verifySession(client wsModels.Client) bool {
	if handler.currentClient == nil {
		handler.currentClient = &client
	}

	//TODO: THIS BOUNDS THE LOGGING TO A PARTICULAR WS CONNECTION
	return handler.currentClient.Id() == client.Id()
}

func (handler *LoggerHandler) start() {
	handler.trace.Info().Str("logger client", handler.currentClient.Id()).Msg("Started logging")
	handler.loggableChan = make(chan Loggable)
	currentTime := time.Now()
	sessionDirName := fmt.Sprintf("%d_%d_%d - %d_%dh", currentTime.Day(), currentTime.Month(), currentTime.Year(), currentTime.Hour(), currentTime.Minute())
	path := filepath.Join(handler.config.BasePath, sessionDirName)
	os.MkdirAll(path, 0777)
	os.Chmod(path, 0777)

	activeLoggers := handler.createActiveLoggers(path)

	go startBroadcastRoutine(activeLoggers, handler.loggableChan)
	handler.isRunning = true
	handler.notifyState()
}

func (handler *LoggerHandler) createActiveLoggers(path string) []ActiveLogger {
	activeLoggers := make([]ActiveLogger, 0)

	for _, logger := range handler.loggers {
		inputChan := logger.Start(path)

		activeLoggers = append(activeLoggers, ActiveLogger{
			Ids:   logger.Ids(),
			Input: inputChan,
		})
	}

	return activeLoggers
}

func startBroadcastRoutine(activeLoggers []ActiveLogger, generalInput <-chan Loggable) {
	for loggable := range generalInput {
		for _, logger := range activeLoggers {
			if logger.Ids.Has(loggable.Id()) {
				logger.Input <- loggable
			}
		}
	}

	defer func() {
		for _, logger := range activeLoggers {
			close(logger.Input)
		}
	}()
}

func (handler *LoggerHandler) stop() {
	handler.trace.Info().Str("logger session", handler.currentClient.Id()).Msg("Stoped logging")
	handler.isRunning = false
	close(handler.loggableChan) // triggers loggers clean-up
	handler.notifyState()
	handler.currentClient = nil
}

func (handler *LoggerHandler) NotifyDisconnect(client wsModels.Client) {
	handler.trace.Debug().Str("session", client.Id()).Msg("notify disconnect")
	if handler.verifySession(client) {
		handler.isRunningMx.Lock()
		if handler.isRunning {
			handler.stop()
		}
		handler.isRunningMx.Unlock()

		handler.currentClient = nil
	}
}

func (handler *LoggerHandler) notifyState() error {
	//TODO: check error handling
	if handler.currentClient == nil {
		return nil
	}

	msgBuf, err := wsModels.NewMessageBuf(ResponseTopic, handler.isRunning)

	if err != nil {
		return err
	}

	err = handler.currentClient.Write(msgBuf)

	if err != nil {
		return err
	}

	return nil
}

func (handler *LoggerHandler) HandlerName() string {
	return LogHandlerHandlerName
}
