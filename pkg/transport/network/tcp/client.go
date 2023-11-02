package tcp

import (
	"fmt"
	"net"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network"
)

var (
	// CLIENT_INITIAL_BACKOFF is the starting value for the client backoff
	CLIENT_INITIAL_BACKOFF = time.Millisecond * 100
	// CLIENT_MAX_BACKOFF is the max value for the client backoff
	CLIENT_MAX_BACKOFF = time.Second * 5
)

// backoff is an abstraction over an exponential backoff algorithmn
type backoff struct {
	base    time.Duration
	current time.Duration
	rate    float32
	max     time.Duration
}

// next returns a channel where a message will be sent once the next period
// of time elapses.
func (b *backoff) next() <-chan time.Time {
	timer := time.NewTimer(b.current)
	return timer.C
}

// reset resets the current value of the backoff to the default one
func (b *backoff) reset() {
	b.current = b.base
}

// increase sets the current value of the backoff to the next one
func (b *backoff) increase() {
	b.current = time.Duration(float32(b.current) * b.rate)
	if b.current > b.max {
		b.current = b.max
	}
}

// Assertion to check the TCPClient is a TCPSource
var _ Source = &Client{}

// Client is a TCPSource that creates connections with a server.
//
// Client must be used the same way as a regular TCPSource, extra methods provided
// are just to configure certain aspects about it.
type Client struct {
	target       abstraction.TransportTarget
	raddr        net.Addr
	dialer       net.Dialer
	onConnection connectionCallback
	onError      errorCallback
	retry        backoff
}

// NewClient creates a new TCPClient for the specified socket.
//
// It returns a non nil err if the one of the socket addresses are invalid.
//
// Target is used internally by the TransportModule to identify the client, it should follow
// this form: "client/<target>"
func NewClient(target abstraction.TransportTarget, socket network.Socket) (*Client, error) {
	laddr, err := net.ResolveTCPAddr("tcp", fmt.Sprintf("%s:%d", socket.SrcIP, socket.SrcPort))
	if err != nil {
		return nil, err
	}
	raddr, err := net.ResolveTCPAddr("tcp", fmt.Sprintf("%s:%d", socket.DstIP, socket.DstPort))
	if err != nil {
		return nil, err
	}

	return &Client{
		target: target,
		raddr:  raddr,
		dialer: net.Dialer{
			LocalAddr: laddr,
			KeepAlive: -1, // Disable default keepalive (defaults to 15s)
			Timeout:   0,  // Default value -> No timeout
		},
		retry: backoff{
			base:    CLIENT_INITIAL_BACKOFF,
			current: CLIENT_INITIAL_BACKOFF,
			rate:    2,
			max:     CLIENT_MAX_BACKOFF,
		},
	}, nil
}

// SetTimeout sets the timeout for the connection to happen, if the connection
// isn't established before this time, it will generate an error and attempt to reconnect
//
// A timeout of 0 means no timeout
func (client *Client) SetTimeout(timeout time.Duration) {
	client.dialer.Timeout = timeout
}

// SetKeepalive sets the keepalive period for the connecion once it is established.
//
// A keepalive of 0 is a default keepalive (15s) and a negative keepalive disables it.
func (client *Client) SetKeepalive(keepalive time.Duration) {
	client.dialer.KeepAlive = keepalive
}

// SetOnConnection registers the callback that will be used when a connection is made
func (client *Client) SetOnConnection(callback connectionCallback) {
	client.onConnection = callback
}

// SetOnError registers the callback that will be used when an error making the connection occurs.
func (client *Client) SetOnError(callback errorCallback) {
	client.onError = callback
}

// Run starts the connection of the client.
//
// If the connection fails, the client tries to reconnect using an exponential backoff algorithmn.
//
// Errors and connections are reported using the OnError and OnConnection callbacks, and should be
// set before calling Run.
//
// Run will block, callers should run this as a goroutine. The execution can be halted by sending a
// message to the cancel message.
func (client *Client) Run(cancel <-chan struct{}) {
	client.retry.reset()
	for {
		backoffTimer := client.retry.next()
		select {
		case <-backoffTimer:
			conn, err := client.dialer.Dial("tcp", client.raddr.String())
			if err == nil {
				client.onConnection(client.target, conn.(*net.TCPConn))
				return
			}
			client.onError(client.target, err)
			client.retry.increase()
		case <-cancel:
			return
		}
	}
}
