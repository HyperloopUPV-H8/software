package sniffer

import "github.com/google/gopacket"

// ErrMissingPayload is returned when a packet being read is missing its payload
type ErrMissingPayload struct {
	layers []gopacket.LayerType
}

// Layers returns the layers the decoded packet had, for debugging and error handling purposes.
func (err ErrMissingPayload) Layers() []gopacket.LayerType {
	return err.layers
}

func (err ErrMissingPayload) Error() string {
	return "no payload found in message"
}
