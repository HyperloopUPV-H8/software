package tcp

import (
	"net"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

// These callbacks are used by the Source and the Conn structs
// connectionCallback is called when a source has obtained a new connection
type connectionCallback = func(abstraction.TransportTarget, *net.TCPConn)

// errorCallback is called when a source encounters an error creating a connection
type errorCallback = func(abstraction.TransportTarget, error)

// stateCallback is called when a Conn connection state changes
type stateCallback = func(abstraction.TransportTarget, bool)

// Source is an interface for different ways of creating TCP connections.
//
// When using sources the caller should first use SetOnConnection and SetOnError
// to ensure both that connections are created correctly and any errors are handled.
//
// Once the callbacks are set, the consumer should execute Run in a goroutine, passing
// an optional channel to stop the execution of the Source
type Source interface {
	// Run starts sourcing connections. Implementations might block, so it is advised
	// to call this in a goroutine to prevent blocking.
	//
	// The provided channel is used to stop the runner, when a message is sent the
	// Source stops creating connections.
	Run(<-chan struct{})

	// SetOnConnection gives the Source the callback it should call when a new connection
	// is established.
	SetOnConnection(connectionCallback)

	// SetOnError gives the Source the callback it should call when an error making a
	// connection is encountered.
	SetOnError(errorCallback)
}

// Conn is a wrapper around a net.TCPConn which gives it an associated target and
// other callbacks
type Conn struct {
	target       abstraction.TransportTarget
	conn         *net.TCPConn
	onConnUpdate stateCallback
}

// NewConn creates a new Conn with the provided parameters
//
// target is the TransportTarget associated with this Conn
//
// conn is the actual network connection
//
// callback is the callback that will be called when the conn connects / disconnects
func NewConn(target abstraction.TransportTarget, conn *net.TCPConn, callback stateCallback) *Conn {
	callback(target, true)
	return &Conn{
		target:       target,
		conn:         conn,
		onConnUpdate: callback,
	}
}

// Target returns the connection TransportTarget
func (tcp *Conn) Target() abstraction.TransportTarget {
	return tcp.target
}

// Read maps the underlying conn Read method
func (tcp *Conn) Read(p []byte) (n int, err error) {
	return tcp.conn.Read(p)
}

// Write maps the underlying conn Write method
func (tcp *Conn) Write(p []byte) (n int, err error) {
	return tcp.conn.Write(p)
}

// Close maps the unterlying conn Close method, calling the appropiate callbacks
// in the process.
func (tcp *Conn) Close() error {
	tcp.onConnUpdate(tcp.target, false)
	return tcp.conn.Close()
}
