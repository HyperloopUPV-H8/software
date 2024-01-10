package transport

import (
	"errors"
	"fmt"
	"io"
	"net"
	"os"
	"sync"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/sniffer"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/tcp"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/tftp"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/presentation"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/session"
)

// Transport is the module in charge of handling network communication with
// the vehicle.
//
// It uses events to differentiate different kinds of messages. Each message
// or notification has an associated event which is used to determine the
// action to take.
type Transport struct {
	decoder *presentation.Decoder
	encoder *presentation.Encoder

	connectionsMx *sync.Mutex
	connections   map[abstraction.TransportTarget]net.Conn

	idToTarget map[abstraction.PacketId]abstraction.TransportTarget

	tftp *tftp.Client

	api abstraction.TransportAPI
}

// HandleClient connects to the specified client and handles its messages. This method blocks.
// This method will try to reconnect to the client if it disconnects mid way through, but after
// enough retries, it will stop.
func (transport *Transport) HandleClient(config tcp.ClientConfig, target abstraction.TransportTarget, network, remote string) error {
	for {
		conn, err := config.Dial(network, remote)
		if err != nil {
			if config.AbortOnError {
				fmt.Fprintf(os.Stderr, "Error connecting to %s: %v\n", target, err)
				return err
			}

			continue
		}

		err = transport.handleTCPConn(target, conn)
		if errors.Is(err, error(ErrTargetAlreadyConnected{})) {
			return err
		}
		if err != nil {
			if config.AbortOnError {
				fmt.Fprintf(os.Stderr, "Error handling connection to %s: %v\n", target, err)
				return err
			}

			continue
		}

		// Wait before trying to reconnect
		config.CurrentRetries = 5
		time.Sleep(config.Backoff(config.CurrentRetries))
	}
}

// HandleServer creates a server on the specified address, listening for all incoming connections and
// handles them.
func (transport *Transport) HandleServer(config tcp.ServerConfig, network, local string) error {
	return config.Listen(network, local, transport.handleTCPConn)
}

// handleTCPConn is used to handle the specific TCP connections to the boards. It detects errors caused
// on concurrent reads and writes, so other routines should not worry about closing or handling errors
func (transport *Transport) handleTCPConn(target abstraction.TransportTarget, conn net.Conn) error {
	if err := func() error {
		transport.connectionsMx.Lock()
		defer transport.connectionsMx.Unlock()
		if _, ok := transport.connections[target]; ok {
			conn.Close()
			return ErrTargetAlreadyConnected{Target: target}
		}
		return nil
	}(); err != nil {
		return err
	}

	if tcpConn, ok := conn.(*net.TCPConn); ok {
		err := tcpConn.SetLinger(0)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error setting %s linger to zero: %v\n", target, err)
		}
	}
	conn, errChan := tcp.WithErrChan(conn)
	defer conn.Close()

	func() {
		transport.connectionsMx.Lock()
		defer transport.connectionsMx.Unlock()
		transport.connections[target] = conn
	}()
	defer func() {
		transport.connectionsMx.Lock()
		defer transport.connectionsMx.Unlock()
		delete(transport.connections, target)
	}()

	transport.api.ConnectionUpdate(target, true)
	defer transport.api.ConnectionUpdate(target, false)

	go func() {
		for {
			packet, err := transport.decoder.DecodeNext(conn)
			if err != nil {
				break
			}

			from := conn.LocalAddr().String()
			to := string(target)

			transport.api.Notification(NewPacketNotification(packet, from, to, time.Now()))
		}
	}()

	return <-errChan
}

// SendMessage triggers an event to send something to the vehicle. Some messages
// might additional means to pass information around (e.g. file read and write)
func (transport *Transport) SendMessage(message abstraction.TransportMessage) error {
	switch msg := message.(type) {
	case PacketMessage:
		return transport.handlePacketEvent(msg)
	case FileWriteMessage:
		return transport.handleFileWrite(msg)
	case FileReadMessage:
		return transport.handleFileRead(msg)
	default:
		return ErrUnrecognizedEvent{message.Event()}
	}
}

// handlePacketEvent is used to send an order to one of the connected boards
func (transport *Transport) handlePacketEvent(message PacketMessage) error {
	target, ok := transport.idToTarget[message.Id()]
	if !ok {
		return ErrUnrecognizedId{Id: message.Id()}
	}

	conn, err := func() (net.Conn, error) {
		transport.connectionsMx.Lock()
		defer transport.connectionsMx.Unlock()
		conn, ok := transport.connections[target]
		if !ok {
			return nil, ErrConnClosed{Target: target}
		}
		return conn, nil
	}()
	if err != nil {
		return err
	}

	data, err := transport.encoder.Encode(message.Packet)
	if err != nil {
		return err
	}

	totalWritten := 0
	for totalWritten < len(data) {
		n, err := conn.Write(data[totalWritten:])
		totalWritten += n
		if err != nil {
			return err
		}
	}

	return nil
}

// handleFileWrite writes a file through tftp to the blcu
func (transport *Transport) handleFileWrite(message FileWriteMessage) error {
	_, err := transport.tftp.WriteFile(message.Filename(), tftp.BinaryMode, message)
	return err
}

// handleFileRead reads a file through tftp from the blcu
func (transport *Transport) handleFileRead(message FileReadMessage) error {
	_, err := transport.tftp.ReadFile(message.Filename(), tftp.BinaryMode, message)
	return err
}

// HandleSniffer starts listening for packets on the provided sniffer and handles them.
func (transport *Transport) HandleSniffer(sniffer *sniffer.Sniffer) error {
	// for {
	// 	_, data, err := sniffer.ReadNext()
	// 	if err != nil {
	// 		return err
	// 	}

	// 	packet, err := transport.decoder.DecodeNext(bytes.NewReader(data))
	// 	if err != nil {
	// 		fmt.Println(err)
	// 		continue
	// 	}

	// 	transport.api.Notification(NewPacketNotification(packet))
	// }
	return session.NewSnifferDemux(transport.handleConversation).ReadPackets(sniffer)
}

// handleConversation is called when the sniffer detects a new conversation and handles its specific packets
func (transport *Transport) handleConversation(socket network.Socket, reader io.Reader) {
	go func() {
		for {
			packet, err := transport.decoder.DecodeNext(reader)
			if err != nil {
				fmt.Println(err)
				return // TODO: handle error
			}

			from := fmt.Sprintf("%s:%d", socket.SrcIP, socket.SrcPort)
			to := fmt.Sprintf("%s:%d", socket.DstIP, socket.DstPort)

			transport.api.Notification(NewPacketNotification(packet, from, to, time.Now()))
		}
	}()
}

// SetAPI sets the API that the Transport will use
func (transport *Transport) SetAPI(api abstraction.TransportAPI) {
	transport.api = api
}
