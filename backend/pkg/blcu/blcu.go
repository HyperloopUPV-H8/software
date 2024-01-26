package blcu

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	broker "github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/blcu"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport"
)

func Request(request abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
	switch request.Topic() {
	case "blcu/download":
		return broker.Download.Pull(request)
	case "blcu/upload":
		return broker.Upload.Pull(request)
	default:
		return nil, ErrTopicNotFound{
			expected: "blcu/download, blcu/upload",
			received: request.Topic(),
		}
	}
}

func SendPush(push abstraction.BrokerPush) error {
	switch push.Topic() {
	case "blcu/download":
		return broker.Download.Push(push)
	case "blcu/upload":
		return broker.Upload.Push(push)
	default:
		return ErrTopicNotFound{
			expected: "blcu/download, blcu/upload",
			received: push.Topic(),
		}
	}
}

func SendMessage(message abstraction.TransportMessage) error {
	err := transport.Transport.SendMessage(message)
	if err != nil {
		return ErrSendMessage{
			received: message,
		}
	}
	return nil
}
