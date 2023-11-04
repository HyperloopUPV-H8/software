package models

type MessageHandler interface {
	//TODO: change to clientId, topic, payload
	UpdateMessage(client Client, message Message)
	HandlerName() string
}
