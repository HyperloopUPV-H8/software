package tftp

import "time"

type clientOption func(client *Client) error

func WithProgressCallback(callback progressCallback) clientOption {
	return func(client *Client) error {
		client.onProgress = callback
		return nil
	}
}

func WithBackoff(backoff func(int) time.Duration) clientOption {
	return func(client *Client) error {
		client.conn.SetBackoff(backoff)
		return nil
	}
}

func WithBlockSize(size int) clientOption {
	return func(client *Client) error {
		client.conn.SetBlockSize(size)
		return nil
	}
}

func WithRetries(count int) clientOption {
	return func(client *Client) error {
		client.conn.SetRetries(count)
		return nil
	}
}

func WithTimeout(timeout time.Duration) clientOption {
	return func(client *Client) error {
		client.conn.SetTimeout(timeout)
		return nil
	}
}
