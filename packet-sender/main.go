package main

import (
	"fmt"
	"log"
	"net"
	"os"
	"os/signal"
	"time"

	"github.com/joho/godotenv"
)

const (
	lip   string = "127.0.0.3"
	lport uint16 = 50400
	rip   string = "127.0.0.4"
	rport uint16 = 50400
)

/* package main

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/HyperloopUPV-H8/h9-backend/internal/adj"
)

func main() {

	adjInstance, err := adj.NewADJ()
	if err != nil {
		log.Fatalf("Error initializing ADJ: %v", err)
	}


	packets := generatePackets(adjInstance)


	output, err := json.MarshalIndent(packets, "", "  ")
	if err != nil {
		log.Fatalf("Error marshalling packets: %v", err)
	}

	fmt.Println(string(output))
}


func generatePackets(adjInstance adj.ADJ) []adj.Packet {
	var allPackets []adj.Packet

	for _, board := range adjInstance.Boards {
		for _, packet := range board.Packets {
			allPackets = append(allPackets, packet)
		}
	}

	return allPackets
}*/

func main() {
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error loading .env", err)
	}

	_ = createListener(lip, lport, rip, rport)
	conn := getConn(lip, lport, rip, rport)
	defer conn.Close()

	packetGenerator := New()
	fmt.Println("Sending packets")

	count := make(chan struct{}, 10000)
	start := time.Now()
	prev := time.Now()
	go func() {
		for {
			packet := packetGenerator.CreateRandomPacket()
			fmt.Println(time.Since(prev))
			prev = time.Now()

			if packet == nil {
				continue
			}
			_, err := conn.Write(packet)

			if err != nil {
				continue
			}

			count <- struct{}{}
		}

	}()

	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)

	c := 0
	for {
		select {
		case <-count:
			c++
		case <-interrupt:
			fmt.Printf("%d, %v\n", c, time.Since(start))
			return
		}
	}

}

func getConn(lip string, lport uint16, rip string, rport uint16) *net.UDPConn {
	laddr, err := net.ResolveUDPAddr("udp", fmt.Sprintf("%s:%d", lip, lport))
	if err != nil {
		log.Fatalf("resolve address: %s\n", err)
	}
	raddr, err := net.ResolveUDPAddr("udp", fmt.Sprintf("%s:%d", rip, rport))
	if err != nil {
		log.Fatalf("resolve address: %s\n", err)
	}
	conn, err := net.DialUDP("udp", laddr, raddr)

	if err != nil {
		log.Fatal("Error creating udp connection", err)
	}

	return conn
}

func createListener(lip string, lport uint16, rip string, rport uint16) *net.UDPConn {
	_, err := net.ResolveUDPAddr("udp", fmt.Sprintf("%s:%d", lip, lport))
	if err != nil {
		log.Fatalf("resolve address: %s\n", err)
	}
	laddr, err := net.ResolveUDPAddr("udp", fmt.Sprintf("%s:%d", rip, rport))
	if err != nil {
		log.Fatalf("resolve address: %s\n", err)
	}
	listener, err := net.ListenUDP("udp", laddr)

	if err != nil {
		log.Fatal("Error creating udp connection", err)
	}

	return listener
}
