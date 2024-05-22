package main

import (
	"bytes"
	"encoding/binary"
	"flag"
	"fmt"
	"io"
	"net"
	"os"
	"os/signal"
	"time"
)

var laddrFlag = flag.String("laddr", "127.0.0.3:50401", "local address for the connection")
var raddrFlag = flag.String("raddr", "127.0.0.1:50500", "remote address for the connection")
var stateOrderIDFlag = flag.Uint("id", 200, "id of the state order to toggle")
var addStateOrderIDFlag = flag.Uint("add-id", 5, "message id to add state orders")
var removeStateOrderIDFlag = flag.Uint("remove-id", 6, "message id to remove state orders")
var delayFlag = flag.Duration("delay", 3*time.Second, "time between consecutive messages")
var readBufferSizeFlag = flag.Int("read-buffer", 1460, "size of the read buffer")

var byteOrder = binary.LittleEndian

func main() {
	flag.Parse()

	conn, err := net.DialTCP("tcp", resolveTCPAddr(*laddrFlag), resolveTCPAddr(*raddrFlag))
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	defer conn.Close()

	closeChan := make(chan error, 10)
	go readConn(conn, closeChan)
	go writeConn(conn, closeChan)

	signalChan := make(chan os.Signal, 10)
	signal.Notify(signalChan, os.Interrupt, os.Kill)

	select {
	case <-signalChan:
		fmt.Println("close signal received")
	case err := <-closeChan:
		fmt.Fprintln(os.Stderr, err)
	}

	fmt.Println("closing...")
}

func resolveTCPAddr(address string) *net.TCPAddr {
	resolved, err := net.ResolveTCPAddr("tcp", address)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	return resolved
}

func readConn(conn *net.TCPConn, closeChan chan<- error) {
	buffer := make([]byte, *readBufferSizeFlag)
	for {
		n, err := conn.Read(buffer)
		fmt.Println(">", string(buffer[:n]))
		if err != nil {
			closeChan <- err
			return
		}
	}
}

func writeConn(conn *net.TCPConn, closeChan chan<- error) {
	addPayload := generateAddPayload()
	removePayload := generateRemovePayload()
	for {
		fmt.Println("< write add")
		_, err := io.Copy(conn, bytes.NewReader(addPayload))
		if err != nil {
			closeChan <- err
			return
		}
		<-time.After(*delayFlag)

		fmt.Println("< write remove")
		_, err = io.Copy(conn, bytes.NewReader(removePayload))
		if err != nil {
			closeChan <- err
			return
		}
		<-time.After(*delayFlag)
	}
}

func generateAddPayload() []byte {
	payload := make([]byte, 6)
	byteOrder.PutUint16(payload[0:2], uint16(*addStateOrderIDFlag))
	byteOrder.PutUint16(payload[2:4], 1)
	byteOrder.PutUint16(payload[4:6], uint16(*stateOrderIDFlag))
	return payload
}

func generateRemovePayload() []byte {
	payload := make([]byte, 6)
	byteOrder.PutUint16(payload[0:2], uint16(*removeStateOrderIDFlag))
	byteOrder.PutUint16(payload[2:4], 1)
	byteOrder.PutUint16(payload[4:6], uint16(*stateOrderIDFlag))
	return payload
}
