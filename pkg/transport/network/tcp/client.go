package tcp

import (
	"fmt"
	"net"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network"
)

var (
	CLIENT_INITIAL_BACKOFF = time.Millisecond * 100
	CLIENT_MAX_BACKOFF     = time.Second * 5
)

type backoff struct {
	base    time.Duration
	current time.Duration
	rate    float32
	max     time.Duration
}

func (b *backoff) next() <-chan time.Time {
	timer := time.NewTimer(b.current)
	return timer.C
}

func (b *backoff) reset() {
	b.current = b.base
}

func (b *backoff) increase() {
	b.current = time.Duration(float32(b.current) * b.rate)
	if b.current > b.max {
		b.current = b.max
	}
}

type TCPClient struct {
	target       abstraction.TransportTarget
	raddr        net.Addr
	dialer       net.Dialer
	onConnection connectionCallback
	onError      errorCallback
	retry        backoff
}

func NewClient(target abstraction.TransportTarget, socket network.Socket) (*TCPClient, error) {
	laddr, err := net.ResolveTCPAddr("tcp", fmt.Sprintf("%s:%d", socket.SrcIP, socket.SrcPort))
	if err != nil {
		return nil, err
	}
	raddr, err := net.ResolveTCPAddr("tcp", fmt.Sprintf("%s:%d", socket.DstIP, socket.DstPort))
	if err != nil {
		return nil, err
	}

	return &TCPClient{
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

func (client *TCPClient) SetTimeout(timeout *time.Duration) {
	if timeout != nil {
		client.dialer.Timeout = *timeout
	} else {
		client.dialer.Timeout = 0
	}
}

func (client *TCPClient) SetKeepalive(keepalive *time.Duration) {
	if keepalive != nil {
		client.dialer.KeepAlive = *keepalive
	} else {
		client.dialer.KeepAlive = -1
	}
}

func (client *TCPClient) SetOnConnection(callback connectionCallback) {
	client.onConnection = callback
}

func (client *TCPClient) SetOnError(callback errorCallback) {
	client.onError = callback
}

func (client *TCPClient) Run(cancel <-chan struct{}) {
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
