package session

import "github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network"

type conversationCallback = func(socket network.Socket, reader SocketReader)

type PacketReader interface {
	ReadNext() (network.Socket, []byte, error)
}

type SnifferDemux struct {
	source         PacketReader
	onConversation conversationCallback
}
