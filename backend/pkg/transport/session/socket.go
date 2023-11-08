package session

import "bytes"

type SocketReader struct {
	buffer *bytes.Buffer
}

func newConversation() *SocketReader {
	return &SocketReader{
		buffer: new(bytes.Buffer),
	}
}

func (reader *SocketReader) Write(p []byte) (n int, err error) {
	return reader.buffer.Write(p)
}

func (reader *SocketReader) Read(p []byte) (n int, err error) {
	return reader.buffer.Read(p)
}
