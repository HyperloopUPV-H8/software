package vehicle

import "github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"

type TransportAPI struct {
	vehicle *Vehicle
}

func (api TransportAPI) Notification(notification abstraction.TransportNotification) {
	api.vehicle.transportNotification(notification)
}
