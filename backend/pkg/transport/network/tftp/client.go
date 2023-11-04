package tftp

import (
	"io"

	"github.com/pin/tftp/v3"
)

// transferMode is the mode for tftp data transfer, this can be either netascii or binary
type transferMode string

const (
	// transfer information in binary mode
	BinaryMode transferMode = "binary"
	// transfer information as text
	AsciiMode transferMode = "netascii"
)

// Client creates a connection with a TFTP server, it handles file uploads and downloads,
// providing a callback to notify of progress
type Client struct {
	conn       *tftp.Client
	onProgress progressCallback
}

// NewClient creates a new client with the provided options.
//
// addr is the server addres where the client will connect to
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

// ReadFile reads the file specified with filename from the server.
// The file is written to the output Writer.
func (client *Client) ReadFile(filename string, mode transferMode, output io.Writer) (int64, error) {
	recv, err := client.conn.Receive(filename, string(mode))
	if err != nil {
		return 0, err
	}

	writer := newProgressWriter(filename, client.onProgress, output)

	n, err := recv.WriteTo(writer)

	return n, err
}

// WriteFile writes the file specified with the filename to the server.
// The file is read from the input Reader.
func (client *Client) WriteFile(filename string, mode transferMode, input io.Reader) (int64, error) {
	send, err := client.conn.Send(filename, string(mode))
	if err != nil {
		return 0, err
	}

	reader := newProgressReader(filename, client.onProgress, input)

	n, err := send.ReadFrom(reader)

	return n, err
}
