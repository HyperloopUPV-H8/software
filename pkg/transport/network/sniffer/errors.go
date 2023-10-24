package sniffer

import "github.com/google/gopacket"

type ErrMissingPayload struct {
	layers []gopacket.LayerType
}

func (err ErrMissingPayload) Error() string {
	return "no payload found in message"
}
