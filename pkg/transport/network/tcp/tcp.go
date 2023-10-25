package tcp

import (
	"net"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type TCPSource interface {
	SetOnConnection(func(*TCPConn))
}

type TCPConn struct {
	target       abstraction.TransportTarget
	conn         *net.TCPConn
	onConnUpdate stateCallback
}

type stateCallback = func(abstraction.TransportTarget, bool)

func NewConn(target abstraction.TransportTarget, conn *net.TCPConn, callback stateCallback) *TCPConn {
	callback(target, true)
	return &TCPConn{
		target:       target,
		conn:         conn,
		onConnUpdate: callback,
	}
}

func (tcp *TCPConn) Read(p []byte) (n int, err error) {
	return tcp.conn.Read(p)
}

func (tcp *TCPConn) Write(p []byte) (n int, err error) {
	return tcp.conn.Write(p)
}

func (tcp *TCPConn) Close() error {
	tcp.onConnUpdate(tcp.target, false)
	return tcp.conn.Close()
}
