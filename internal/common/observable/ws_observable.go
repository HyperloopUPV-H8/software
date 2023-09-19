package observable

import (
	"encoding/json"

	wsModels "github.com/HyperloopUPV-H8/h9-backend/internal/ws_handle/models"
)

type SubscriptionMessage struct {
	Id        string `json:"id"`
	Subscribe bool   `json:"subscribe"`
}

func HandleSubscribe[T any](obs Observable[T], msg wsModels.Message, client wsModels.Client) {
	var subscription SubscriptionMessage
	err := json.Unmarshal(msg.Payload, &subscription)

	if err != nil {
		return
	}

	if subscription.Subscribe {
		addWsObserver(obs, subscription.Id, msg.Topic, client)
	} else {
		obs.Unsubscribe(subscription.Id)
	}
}

func addWsObserver[T any](obs Observable[T], id string, topic string, client wsModels.Client) {
	observer := NewWsObserver(id, func(v T) {
		msg, err := wsModels.NewMessage(topic, v)

		if err != nil {
			return
		}

		msgBuf, err := json.Marshal(msg)

		if err != nil {
			return
		}

		err = client.Write(msgBuf)

		if err != nil {
			obs.Unsubscribe(id)
		}
	})

	obs.Subscribe(observer)
}

type WsObserver[T any] struct {
	id           string
	handleUpdate func(v T)
}

func NewWsObserver[T any](id string, handleUpdate func(v T)) WsObserver[T] {
	return WsObserver[T]{
		id:           id,
		handleUpdate: handleUpdate,
	}
}

func (o WsObserver[T]) Id() string {
	return o.id
}

func (o WsObserver[T]) Next(v T) {
	o.handleUpdate(v)
}
