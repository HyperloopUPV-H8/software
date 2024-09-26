package main

import (
	"bytes"
	"encoding/binary"
	"flag"
	"fmt"
	"io"
	"math"
	"net"
	"os"
	"time"
)

var raddrRaw = flag.String("r", "127.0.0.1:50400", "Remote address to send data to")
var laddrRaw = flag.String("l", "127.0.0.9:50400", "Local address to send data from")
var sendGoodTime = flag.Duration("sg", 2*time.Second, "Time good data will be sent")
var sendBadTime = flag.Duration("sb", 2*time.Second, "Time bad data will be sent")
var sendDelay = flag.Duration("d", 1*time.Nanosecond, "Delay between packets")

func main() {
	flag.Parse()

	laddr, err := net.ResolveUDPAddr("udp", *laddrRaw)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	raddr, err := net.ResolveUDPAddr("udp", *raddrRaw)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	go listenUDP(raddr)

	conn, err := net.DialUDP("udp", laddr, raddr)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	defer conn.Close()

	packetTicker := time.NewTicker(*sendDelay)
	for {
		okWait := time.After(*sendGoodTime)
	okLoop:
		for {
			select {
			case <-packetTicker.C:
				err := sendPacket(conn, goodPacket)
				if err != nil {
					fmt.Fprintln(os.Stderr, err)
					os.Exit(1)
				}
			case <-okWait:
				break okLoop
			}
		}
		badWait := time.After(*sendBadTime)
	badLoop:
		for {
			select {
			case <-packetTicker.C:
				err := sendPacket(conn, badPacket)
				if err != nil {
					fmt.Fprintln(os.Stderr, err)
					os.Exit(1)
				}
			case <-badWait:
				break badLoop
			}
		}
	}
}

func listenUDP(addr *net.UDPAddr) {
	listener, err := net.ListenUDP("udp", addr)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	defer listener.Close()

	buffer := make([]byte, 1500)
	for {
		_, err := listener.Read(buffer)
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
	}
}

func sendPacket(conn *net.UDPConn, packet []byte) error {
	packetReader := bytes.NewReader(packet)
	_, err := io.Copy(conn, packetReader)
	return err
}

var goodPacket = createGoodPacket()
var badPacket = createBadPacket()

var byteOrder = binary.LittleEndian

func createGoodPacket() []byte {
	packet := make([]byte, 51)
	byteOrder.PutUint16(packet[0:2], 910)                      // ID
	byteOrder.PutUint32(packet[2:6], math.Float32bits(80.0))   // SoC
	byteOrder.PutUint32(packet[6:10], math.Float32bits(3.9))   // Cell 1
	byteOrder.PutUint32(packet[10:14], math.Float32bits(3.9))  // Cell 2
	byteOrder.PutUint32(packet[14:18], math.Float32bits(3.9))  // Cell 3
	byteOrder.PutUint32(packet[18:22], math.Float32bits(3.9))  // Cell 4
	byteOrder.PutUint32(packet[22:26], math.Float32bits(3.9))  // Cell 5
	byteOrder.PutUint32(packet[26:30], math.Float32bits(3.9))  // Cell 6
	byteOrder.PutUint32(packet[30:34], math.Float32bits(3.9))  // Min Cell
	byteOrder.PutUint32(packet[34:38], math.Float32bits(3.9))  // Max Cell
	byteOrder.PutUint32(packet[38:42], math.Float32bits(25.8)) // Temp 1
	byteOrder.PutUint32(packet[42:46], math.Float32bits(25.8)) // Temp 2
	packet[46] = 0                                             // IsBalancing
	byteOrder.PutUint32(packet[47:51], math.Float32bits(23.4)) // Total Voltage
	return packet
}

//6.5
//-43

func createBadPacket() []byte {
	packet := make([]byte, 51)
	byteOrder.PutUint16(packet[0:2], 910)                      // ID
	byteOrder.PutUint32(packet[2:6], math.Float32bits(0.0))    // SoC
	byteOrder.PutUint32(packet[6:10], math.Float32bits(6.55))  // Cell 1
	byteOrder.PutUint32(packet[10:14], math.Float32bits(6.55)) // Cell 2
	byteOrder.PutUint32(packet[14:18], math.Float32bits(6.55)) // Cell 3
	byteOrder.PutUint32(packet[18:22], math.Float32bits(6.55)) // Cell 4
	byteOrder.PutUint32(packet[22:26], math.Float32bits(6.55)) // Cell 5
	byteOrder.PutUint32(packet[26:30], math.Float32bits(6.55)) // Cell 6
	byteOrder.PutUint32(packet[30:34], math.Float32bits(6.55)) // Min Cell
	byteOrder.PutUint32(packet[34:38], math.Float32bits(6.55)) // Max Cell
	byteOrder.PutUint32(packet[38:42], math.Float32bits(-45))  // Temp 1
	byteOrder.PutUint32(packet[42:46], math.Float32bits(-45))  // Temp 2
	packet[46] = 0                                             // IsBalancing
	byteOrder.PutUint32(packet[47:51], math.Float32bits(39.3)) // Total Voltage
	return packet
}
