package data_test

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/broker/topics/blcu"
	"github.com/rs/zerolog/log"
)

var errorFlag bool

type OutputNotMatchingError struct{}

func (e *OutputNotMatchingError) Error() string {
	return "Output does not match"
}

type MockAPI struct{}

func (api MockAPI) UserPush(push abstraction.BrokerPush) error {
	return nil
}

func (api MockAPI) UserPull(request abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
	return nil, nil
}

func Test