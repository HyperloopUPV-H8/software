package main

import (
	"encoding/binary"
	"fmt"
	"log"
	"math/rand"
	"net"
	"os"
	"os/signal"
	"path"
	"time"

	adj_module "github.com/HyperloopUPV-H8/h9-backend/pkg/adj"
)

type boardConn struct {
	conn    *net.UDPConn
	packets []adj_module.Packet
	board   adj_module.Board
}

func main() {

	adj := getADJ()

	defer func() {
		err := os.RemoveAll("adj")
		if err != nil {
			log.Fatalf("Failed to delete ADJ")
		}
	}()

	backend_address := adj.Info.Addresses["BACKEND"]
	backend_port := adj.Info.Ports["UDP"]

	// Create a listener so the packets don't get lost (the backend will sniff them)
	listener, err := net.ListenUDP("udp", &net.UDPAddr{IP: net.ParseIP(backend_address), Port: int(backend_port)})
	if err != nil {
		log.Fatalf("Error creando listener UDP: %v", err)
	}
	defer listener.Close()

	conns := getConns(adj)

	defer func() {
		for _, c := range conns {
			c.conn.Close()
		}
	}()

	// Get the list of packets for each board
	for i := range conns {
		getBoardPackets(&conns[i])
	}

	count := make(chan struct{}, 10000)
	start := time.Now()
	prev := time.Now()
	go func() {
		ticker := time.NewTicker(10 * time.Millisecond)
		defer ticker.Stop()
		for {
			<-ticker.C

			// Get a random board to send the packet from
			randomIndex := rand.Int63n(int64(len(conns)))
			randomBoard := conns[randomIndex]

			packet := randomBoard.CreateRandomPacket()
			fmt.Println(time.Since(prev))
			prev = time.Now()

			if packet == nil || len(packet) < 2 {
				continue
			}

			fmt.Printf("Enviando paquete ID: %d, tamaño: %d\n", binary.LittleEndian.Uint16(packet), len(packet))
			_, err := randomBoard.conn.Write(packet)
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

func getConns(adj adj_module.ADJ) []boardConn {
	conns := make([]boardConn, 0)

	for _, board := range adj.Boards {
		conn := getConn(board.IP, 0, "127.0.0.9", 8000)
		conns = append(conns, boardConn{
			conn:    conn,
			packets: []adj_module.Packet{},
			board:   board,
		})
	}

	return conns
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

func getADJ() adj_module.ADJ {
	var err error

	// Copy the ADJ from the backend folder to ensure they are the same
	err = CopyDir(path.Join("..", "backend", "cmd", "adj"), "adj")
	if err != nil {
		log.Fatal(err)
	}

	adj, err := adj_module.NewADJ("", false)
	if err != nil {
		log.Fatalf("Failed to load ADJ: %v\n", err)
	}

	return adj
}
