package blcu

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	broker "github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/blcu"
)

type BLCU struct {
	boardToId map[string]abstraction.BoardId
}

func NewBLCU(boarMap map[string]abstraction.BoardId) *BLCU {
	return &BLCU{
		boardToId: boarMap,
	}
}

func (blcu *BLCU) Request(request abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
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

func (blcu *BLCU) SendPush(push abstraction.BrokerPush) error {
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
