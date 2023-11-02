package tcp

import (
	"net"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

type connectionCallback = func(abstraction.TransportTarget, *net.TCPConn)
type errorCallback = func(abstraction.TransportTarget, error)
type stateCallback = func(abstraction.TransportTarget, bool)

type Source interface {
	Run(<-chan struct{})
	SetOnConnection(connectionCallback)
	SetOnError(errorCallback)
}

type Conn struct {
	target       abstraction.TransportTarget
	conn         *net.TCPConn
	onConnUpdate stateCallback
}

func NewConn(target abstraction.TransportTarget, conn *net.TCPConn, callback stateCallback) *Conn {
	callback(target, true)
	return &Conn{
		target:       target,
		conn:         conn,
		onConnUpdate: callback,
	}
}

func (tcp *Conn) Read(p []byte) (n int, err error) {
	return tcp.conn.Read(p)
}

func (tcp *Conn) Write(p []byte) (n int, err error) {
	return tcp.conn.Write(p)
}

func (tcp *Conn) Close() error {
	tcp.onConnUpdate(tcp.target, false)
	return tcp.conn.Close()
}
