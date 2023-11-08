package session

import (
	"bytes"
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network"
)

type conversationCallback = func(socket network.Socket, reader io.Reader)

type PacketReader interface {
	ReadNext() (network.Socket, []byte, error)
}

type SnifferDemux struct {
	onConversation conversationCallback
	conversations  map[network.Socket]*bytes.Buffer
}

func (demux *SnifferDemux) ReadPackets(reader PacketReader) error {
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
