package session

import (
	"bytes"
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network"
)

// conversationCallback is called when a new conversation is detected, the conversation socket,
// as well as the reader to get its packets, is provided through this callback.
type conversationCallback = func(socket network.Socket, reader io.Reader)

// packetReader is a reader that generates packets from network connections
type packetReader interface {
	ReadNext() (network.Socket, []byte, error)
}

// Sniffer demux is a helper that takes all packets returned by the Sniffer and splits their
// contents onto buffers based on the source and destination IPs and ports
type SnifferDemux struct {
	onConversation conversationCallback
	conversations  map[network.Socket]*bytes.Buffer
}

// NewSnifferDemux creates a new SnifferDemux with the provided onConversation callback
func NewSnifferDemux(onConversation conversationCallback) *SnifferDemux {
	return &SnifferDemux{
		conversations:  make(map[network.Socket]*bytes.Buffer),
		onConversation: onConversation,
	}
}

// ReadPackets consumes the provided PacketReader.
//
// ReadPackets will block until an error is returned, callers are advised to run this
// in a goroutine.
func (demux *SnifferDemux) ReadPackets(reader packetReader) error {
	for {
		socket, data, err := reader.ReadNext()
		if err != nil {
			return err
		}

		conversation, ok := demux.conversations[socket]
		if !ok {
			demux.conversations[socket] = new(bytes.Buffer)
			conversation = demux.conversations[socket]
			demux.onConversation(socket, conversation)
		}

		_, err = conversation.Write(data)
		if err != nil {
			return err
		}
	}
}
