package tftp

import (
	"io"

	"github.com/pin/tftp/v3"
)

type transferMode string

const (
	BinaryMode transferMode = "binary"
	AsciiMode  transferMode = "netascii"
)

type Client struct {
	conn       *tftp.Client
	onProgress progressCallback
}

func NewClient(addr string, opts ...clientOption) (*Client, error) {
	conn, err := tftp.NewClient(addr)
	if err != nil {
		return nil, err
	}

	client := &Client{
		conn: conn,
	}

	for _, opt := range opts {
		err = opt(client)
		if err != nil {
			return nil, err
		}
	}

	return client, nil
}

func (client *Client) ReadFile(filename string, mode transferMode, output io.Writer) (int64, error) {
	recv, err := client.conn.Receive(filename, string(mode))
	if err != nil {
		return 0, err
	}

	writer := newProgressWriter(filename, client.onProgress, output)

	n, err := recv.WriteTo(writer)

	return n, err
}

func (client *Client) WriteFile(filename string, mode transferMode, input io.Reader) (int64, error) {
	send, err := client.conn.Send(filename, string(mode))
	if err != nil {
		return 0, err
	}

	reader := newProgressReader(filename, client.onProgress, input)

	n, err := send.ReadFrom(reader)

	return n, err
}
