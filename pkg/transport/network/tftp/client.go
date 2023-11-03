package tftp

import (
	"io"

	"github.com/pin/tftp/v3"
)

type Client struct {
	mode       string
	conn       *tftp.Client
	onProgress progressCallback
}

func (client *Client) ReadFile(filename string, output io.Writer) (int64, error) {
	recv, err := client.conn.Receive(filename, client.mode)
	if err != nil {
		return 0, err
	}

	writer := newProgressWriter(filename, client.onProgress, output)

	n, err := recv.WriteTo(writer)

	return n, err
}

func (client *Client) WriteFile(filename string, input io.Reader) (int64, error) {
	send, err := client.conn.Send(filename, client.mode)
	if err != nil {
		return 0, err
	}

	reader := newProgressReader(filename, client.onProgress, input)

	n, err := send.ReadFrom(reader)

	return n, err
}
