package tftp

import "time"

// clientOption is an option that can be applied to a Client.
// It might fail and return the reason.
type clientOption func(client *Client) error

// WithProgressCallback will set the progress callback for the client.
func WithProgressCallback(callback progressCallback) clientOption {
	return func(client *Client) error {
		client.onProgress = callback
		return nil
	}
}

// WithBackoff will specify the backoff algorithm for the client.
func WithBackoff(backoff func(int) time.Duration) clientOption {
	return func(client *Client) error {
		client.conn.SetBackoff(backoff)
		return nil
	}
}

// WithBlockSize will specify the block size for messages exchanged.
func WithBlockSize(size int) clientOption {
	return func(client *Client) error {
		client.conn.SetBlockSize(size)
		return nil
	}
}

// WithRetries will set the max retries before aborting the transfer.
func WithRetries(count int) clientOption {
	return func(client *Client) error {
		client.conn.SetRetries(count)
		return nil
	}
}

// WithTimeout will set the time between retries the client has.
func WithTimeout(timeout time.Duration) clientOption {
	return func(client *Client) error {
		client.conn.SetTimeout(timeout)
		return nil
	}
}
