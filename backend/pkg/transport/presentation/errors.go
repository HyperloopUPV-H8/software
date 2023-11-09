package presentation

import (
	"fmt"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type ErrUnexpectedId struct {
	Id abstraction.PacketId
}

func (err ErrUnexpectedId) Error() string {
	return fmt.Sprintf("unexpected id %d", err.Id)
}
