package blcu

import (
	"fmt"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type ErrTopicNotFound struct {
	expected abstraction.BrokerTopic
	received abstraction.BrokerTopic
}

func (err ErrTopicNotFound) Error() string {
	return fmt.Sprintf("topic not found: got %s expected %s", err.received, err.expected)
}

type ErrSendMessage struct {
	received abstraction.TransportMessage
}

func (err ErrSendMessage) Error() string {
	return fmt.Sprintf("message not sent: got %s", err.received)
}
