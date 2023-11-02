package tftp

import "io"

type Client struct {
}

func (client *Client) Read(filename string, output io.Writer) error {
	panic("TODO!")
}

func (client *Client) Write(filename string, input io.Reader) error {
	panic("TODO!")
}
