package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"time"

	"github.com/pelletier/go-toml/v2"
)

const (
	lip   string = "127.0.0.3"
	lport uint16 = 8000
	rip   string = "127.0.0.4"
	rport uint16 = 8000
)

type ServerConfig struct {
	Addr      string `toml:"address"`
	Endpoints struct {
		PodData           string `toml:"pod_data"`
		OrderData         string `toml:"order_data"`
		ProgramableBoards string `toml:"programable_boards"`
	} `toml:"endpoints"`
}

type Config struct {
	Server map[string]ServerConfig
}

func main() {

	config := getConfig("./config.toml")

	serverConfig, ok := config.Server["ethernet-view"]
	if !ok {
		log.Fatalf("Server configuration for 'ethernet-view' not found")
	}

	go startHTTPServer(serverConfig)

	startUDPPacketSender()
}

func getConfig(path string) Config {
	configFile, err := os.ReadFile(path)
	if err != nil {
		log.Fatalf("Error reading config file: %v", err)
	}

	var config Config
	err = toml.Unmarshal(configFile, &config)
	if err != nil {
		log.Fatalf("Error unmarshaling config file: %v", err)
	}

	return config
}

func startUDPPacketSender() {
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

func startHTTPServer(serverConfig ServerConfig) {
	mux := http.NewServeMux()

	if strings.TrimSpace(serverConfig.Endpoints.PodData) == "" {
		serverConfig.Endpoints.PodData = "/podData"
	}
	if strings.TrimSpace(serverConfig.Endpoints.OrderData) == "" {
		serverConfig.Endpoints.OrderData = "/orderData"
	}
	if strings.TrimSpace(serverConfig.Endpoints.ProgramableBoards) == "" {
		serverConfig.Endpoints.ProgramableBoards = "/programableBoards"
	}

	mux.HandleFunc(serverConfig.Endpoints.PodData, emptyHandler)
	mux.HandleFunc(serverConfig.Endpoints.OrderData, emptyHandler)
	mux.HandleFunc(serverConfig.Endpoints.ProgramableBoards, emptyHandler)

	fmt.Printf("Starting HTTP server on %s\n", serverConfig.Addr)
	err := http.ListenAndServe(serverConfig.Addr, mux)
	if err != nil {
		log.Fatalf("Error starting HTTP server: %v", err)
	}
}

func emptyHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "OK"})
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
