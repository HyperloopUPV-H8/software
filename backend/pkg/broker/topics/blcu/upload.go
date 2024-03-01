package blcu

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/websocket"
)

const UploadName abstraction.BrokerTopic = "blcu/upload"

type Upload struct {
	pool *websocket.Pool
	api  abstraction.BrokerAPI
}

func (upload *Upload) Topic() abstraction.BrokerTopic {
	return UploadName
}

func (upload *Upload) UserPush(push abstraction.BrokerPush) error {
	return upload.api.UserPush(push)
}

func (upload *Upload) UserPull(request abstraction.BrokerRequest) (abstraction.BrokerResponse, error) {
	return upload.api.UserPull(request)
}

func (upload *Upload) SetPool(pool *websocket.Pool) {
	upload.pool = pool
}

func (upload *Upload) SetAPI(api abstraction.BrokerAPI) {
	upload.api = api
}
