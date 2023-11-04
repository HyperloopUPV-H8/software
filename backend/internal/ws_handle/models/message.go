package models

import "encoding/json"

type Message struct {
	Topic   string          `json:"topic"`
	Payload json.RawMessage `json:"payload"`
}

func NewMessage(topic string, message any) (Message, error) {
	messageRaw, err := json.Marshal(message)

	return Message{
		Topic:   topic,
		Payload: messageRaw,
	}, err
}

func NewMessageBuf(topic string, v any) ([]byte, error) {
	msg, err := NewMessage(topic, v)

	if err != nil {
		return nil, err
	}

	msgBuf, err := json.Marshal(msg)

	if err != nil {
		return nil, err
	}

	return msgBuf, nil

}
