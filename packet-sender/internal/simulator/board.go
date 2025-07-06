package simulator

import (
	"context"
	"encoding/binary"
	"fmt"
	"net"
	"sync"
	"time"

	adj_module "github.com/HyperloopUPV-H8/h9-backend/pkg/adj"
)

type BoardSimulator struct {
	board        adj_module.Board
	config       *Config
	tcpConn      net.Conn
	udpConn      *net.UDPConn
	udpAddr      *net.UDPAddr
	tcpConnected bool
	udpConnected bool
	connMutex    sync.RWMutex
	ctx          context.Context
	cancel       context.CancelFunc
	logger       Logger
	packetChan   chan []byte
	statsChan    chan PacketStat
	
	// Packet generators
	dataGenerator       *DataPacketGenerator
	protectionGenerator *ProtectionPacketGenerator
	stateGenerator      *StatePacketGenerator
	orderGenerator      *OrderPacketGenerator
	
	// Connection management
	backoffDuration time.Duration
	maxBackoff      time.Duration
	retryCount      int
	maxRetries      int
}


type Config struct {
	BackendAddress     string
	BackendPort        int    // UDP port (default 8000)
	BackendTCPPort     int    // TCP port (default 50500)
	Protocol           string // "tcp" or "udp" - deprecated, now uses both
	AutoReconnect      bool
	ReconnectInterval  time.Duration
	MaxRetries         int
	PacketInterval     time.Duration
	EnableProtections  bool
	EnableStateChanges bool
	EnableOrderAcks    bool
	ManualMode         bool   // If true, disables automatic packet generation
	LogLevel           string
}

type Logger interface {
	Debug(msg string, args ...interface{})
	Info(msg string, args ...interface{})
	Warn(msg string, args ...interface{})
	Error(msg string, args ...interface{})
}

type PacketStat struct {
	BoardID     string
	PacketID    uint16
	PacketType  string
	Size        int
	Timestamp   time.Time
	Success     bool
	Error       error
}

func NewBoardSimulator(board adj_module.Board, config *Config, logger Logger) *BoardSimulator {
	ctx, cancel := context.WithCancel(context.Background())
	
	return &BoardSimulator{
		board:         board,
		config:        config,
		ctx:           ctx,
		cancel:        cancel,
		logger:        logger,
		packetChan:    make(chan []byte, 100),
		statsChan:     make(chan PacketStat, 100),
		maxBackoff:    30 * time.Second,
		maxRetries:    config.MaxRetries,
		
		dataGenerator:       NewDataPacketGenerator(board, logger),
		protectionGenerator: NewProtectionPacketGenerator(board, logger),
		stateGenerator:      NewStatePacketGenerator(board, logger),
		orderGenerator:      NewOrderPacketGenerator(board, logger),
	}
}

func (bs *BoardSimulator) Start() error {
	bs.logger.Info("Starting board simulator for %s", bs.board.Name)
	
	// Start connection management
	go bs.connectionManager()
	
	// Start packet generators only if not in manual mode
	if !bs.config.ManualMode {
		go bs.packetGeneratorLoop()
	}
	
	// Start packet sender
	go bs.packetSender()
	
	return nil
}

func (bs *BoardSimulator) Stop() {
	bs.logger.Info("Stopping board simulator for %s", bs.board.Name)
	bs.cancel()
	
	bs.safeCloseConnection()
}

func (bs *BoardSimulator) IsConnected() bool {
	bs.connMutex.RLock()
	defer bs.connMutex.RUnlock()
	return bs.tcpConnected && bs.tcpConn != nil
}

func (bs *BoardSimulator) IsUDPConnected() bool {
	bs.connMutex.RLock()
	defer bs.connMutex.RUnlock()
	return bs.udpConnected && bs.udpConn != nil
}

func (bs *BoardSimulator) safeCloseConnection() {
	bs.connMutex.Lock()
	defer bs.connMutex.Unlock()
	
	bs.tcpConnected = false
	bs.udpConnected = false
	
	// Close TCP connection
	if bs.tcpConn != nil {
		func() {
			defer func() {
				if r := recover(); r != nil {
					bs.logger.Debug("Panic during TCP connection close for %s: %v", bs.board.Name, r)
				}
			}()
			bs.tcpConn.Close()
		}()
		bs.tcpConn = nil
	}
	
	// Close UDP connection
	if bs.udpConn != nil {
		func() {
			defer func() {
				if r := recover(); r != nil {
					bs.logger.Debug("Panic during UDP connection close for %s: %v", bs.board.Name, r)
				}
			}()
			bs.udpConn.Close()
		}()
		bs.udpConn = nil
	}
}

func (bs *BoardSimulator) safeCloseTCPConnection() {
	bs.connMutex.Lock()
	defer bs.connMutex.Unlock()
	
	bs.tcpConnected = false
	if bs.tcpConn != nil {
		func() {
			defer func() {
				if r := recover(); r != nil {
					bs.logger.Debug("Panic during TCP connection close for %s: %v", bs.board.Name, r)
				}
			}()
			bs.tcpConn.Close()
		}()
		bs.tcpConn = nil
	}
}

func (bs *BoardSimulator) safeCloseUDPConnection() {
	bs.connMutex.Lock()
	defer bs.connMutex.Unlock()
	
	bs.udpConnected = false
	if bs.udpConn != nil {
		func() {
			defer func() {
				if r := recover(); r != nil {
					bs.logger.Debug("Panic during UDP connection close for %s: %v", bs.board.Name, r)
				}
			}()
			bs.udpConn.Close()
		}()
		bs.udpConn = nil
	}
}

func (bs *BoardSimulator) GetStats() <-chan PacketStat {
	return bs.statsChan
}

func (bs *BoardSimulator) connectionManager() {
	// Start both TCP and UDP connection managers
	go bs.tcpConnectionManager()
	go bs.udpConnectionManager()
}

func (bs *BoardSimulator) tcpConnectionManager() {
	for {
		select {
		case <-bs.ctx.Done():
			return
		default:
			bs.connMutex.RLock()
			isConnected := bs.tcpConnected && bs.tcpConn != nil
			bs.connMutex.RUnlock()
			
			if !isConnected {
				if err := bs.connectTCP(); err != nil {
					bs.logger.Debug("Failed to connect TCP for board %s: %v", bs.board.Name, err)
					
					// Use exponential backoff for failed connections
					bs.retryCount++
					backoff := time.Duration(bs.retryCount) * bs.config.ReconnectInterval
					if backoff > bs.maxBackoff {
						backoff = bs.maxBackoff
					}
					
					bs.logger.Debug("Board %s will retry TCP connection in %v", bs.board.Name, backoff)
					time.Sleep(backoff)
				} else {
					bs.logger.Info("Successfully connected TCP for board %s", bs.board.Name)
					bs.resetBackoff()
					// Start TCP keepalive
					go bs.tcpKeepalive()
				}
			} else {
				// Already connected, check less frequently
				time.Sleep(bs.config.ReconnectInterval)
			}
		}
	}
}

func (bs *BoardSimulator) udpConnectionManager() {
	for {
		select {
		case <-bs.ctx.Done():
			return
		default:
			bs.connMutex.RLock()
			isConnected := bs.udpConnected && bs.udpConn != nil
			bs.connMutex.RUnlock()
			
			if !isConnected {
				if err := bs.connectUDP(); err != nil {
					bs.logger.Debug("Failed to connect UDP for board %s: %v", bs.board.Name, err)
					time.Sleep(bs.config.ReconnectInterval)
				} else {
					bs.logger.Info("Successfully connected UDP for board %s", bs.board.Name)
				}
			} else {
				// Already connected, check less frequently
				time.Sleep(bs.config.ReconnectInterval * 2)
			}
		}
	}
}

func (bs *BoardSimulator) connectTCP() error {
	// Use TCP-specific port
	tcpPort := bs.config.BackendTCPPort
	if tcpPort == 0 {
		tcpPort = 50500 // Default TCP port
	}
	address := fmt.Sprintf("%s:%d", bs.config.BackendAddress, tcpPort)
	
	// Set source address to board's IP
	localAddr, err := net.ResolveTCPAddr("tcp", fmt.Sprintf("%s:0", bs.board.IP))
	if err != nil {
		return fmt.Errorf("failed to resolve local address: %w", err)
	}
	
	remoteAddr, err := net.ResolveTCPAddr("tcp", address)
	if err != nil {
		return fmt.Errorf("failed to resolve remote address: %w", err)
	}
	
	conn, err := net.DialTCP("tcp", localAddr, remoteAddr)
	if err != nil {
		bs.logger.Error("Failed to connect TCP for board %s: %s -> %s: %v", bs.board.Name, localAddr, remoteAddr, err)
		return fmt.Errorf("failed to dial TCP: %w", err)
	}
	
	bs.connMutex.Lock()
	bs.tcpConn = conn
	bs.tcpConnected = true
	bs.connMutex.Unlock()
	
	bs.logger.Info("TCP connection established for board %s: %s -> %s", bs.board.Name, localAddr, remoteAddr)
	
	return nil
}

func (bs *BoardSimulator) connectUDP() error {
	// Use UDP port (BackendPort)
	udpPort := bs.config.BackendPort
	if udpPort == 0 {
		udpPort = 8000 // Default UDP port
	}
	address := fmt.Sprintf("%s:%d", bs.config.BackendAddress, udpPort)
	
	localAddr, err := net.ResolveUDPAddr("udp", fmt.Sprintf("%s:0", bs.board.IP))
	if err != nil {
		return fmt.Errorf("failed to resolve local address: %w", err)
	}
	
	remoteAddr, err := net.ResolveUDPAddr("udp", address)
	if err != nil {
		return fmt.Errorf("failed to resolve remote address: %w", err)
	}
	
	// Create an unconnected UDP socket for pcap compatibility
	conn, err := net.ListenUDP("udp", localAddr)
	if err != nil {
		return fmt.Errorf("failed to create UDP socket: %w", err)
	}
	
	bs.connMutex.Lock()
	bs.udpConn = conn
	bs.udpAddr = remoteAddr
	bs.udpConnected = true
	bs.connMutex.Unlock()
	
	bs.logger.Info("UDP connection established for board %s: %s -> %s", bs.board.Name, localAddr, remoteAddr)
	
	return nil
}

func (bs *BoardSimulator) tcpKeepalive() {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()
	
	for {
		select {
		case <-bs.ctx.Done():
			return
		case <-ticker.C:
			bs.connMutex.RLock()
			isConnected := bs.tcpConnected
			bs.connMutex.RUnlock()
			
			if !isConnected {
				return
			}
			
			// Send keepalive packet (empty packet with ID 0)
			keepalive := make([]byte, 2)
			binary.LittleEndian.PutUint16(keepalive, 0)
			
			if err := bs.writePacketTCP(keepalive); err != nil {
				bs.logger.Debug("TCP keepalive failed for %s: %v", bs.board.Name, err)
				bs.safeCloseTCPConnection()
				return
			}
		}
	}
}

func (bs *BoardSimulator) handleConnectionError() {
	bs.safeCloseConnection()
	
	bs.retryCount++
	if bs.retryCount <= bs.maxRetries {
		bs.backoffDuration = time.Duration(bs.retryCount) * bs.config.ReconnectInterval
		if bs.backoffDuration > bs.maxBackoff {
			bs.backoffDuration = bs.maxBackoff
		}
		
		bs.logger.Warn("Connection failed for board %s, retrying in %v (attempt %d/%d)", 
			bs.board.Name, bs.backoffDuration, bs.retryCount, bs.maxRetries)
		
		time.Sleep(bs.backoffDuration)
	} else if bs.config.AutoReconnect {
		bs.logger.Warn("Max retries exceeded for board %s, continuing to retry...", bs.board.Name)
		bs.retryCount = 0
		time.Sleep(bs.maxBackoff)
	}
}

func (bs *BoardSimulator) resetBackoff() {
	bs.retryCount = 0
	bs.backoffDuration = bs.config.ReconnectInterval
}

func (bs *BoardSimulator) packetGeneratorLoop() {
	ticker := time.NewTicker(bs.config.PacketInterval)
	defer ticker.Stop()
	
	for {
		select {
		case <-bs.ctx.Done():
			return
		case <-ticker.C:
			if bs.IsConnected() {
				bs.generatePackets()
			}
		}
	}
}

func (bs *BoardSimulator) generatePackets() {
	bs.connMutex.RLock()
	tcpConnected := bs.tcpConnected
	udpConnected := bs.udpConnected
	bs.connMutex.RUnlock()
	
	// Generate data packets if UDP is connected
	if udpConnected {
		if packet := bs.dataGenerator.GeneratePacket(); packet != nil {
			select {
			case bs.packetChan <- packet:
			default:
				bs.logger.Warn("Packet channel full, dropping data packet")
			}
		}
		
		// Generate state packets if enabled and UDP connected
		if bs.config.EnableStateChanges {
			if packet := bs.stateGenerator.GeneratePacket(); packet != nil {
				select {
				case bs.packetChan <- packet:
				default:
					bs.logger.Warn("Packet channel full, dropping state packet")
				}
			}
		}
		
		// Generate order acknowledgments if enabled and UDP connected
		if bs.config.EnableOrderAcks {
			if packet := bs.orderGenerator.GeneratePacket(); packet != nil {
				select {
				case bs.packetChan <- packet:
				default:
					bs.logger.Warn("Packet channel full, dropping order packet")
				}
			}
		}
	}
	
	// Generate protection packets if enabled and TCP is connected
	if tcpConnected && bs.config.EnableProtections {
		if packet := bs.protectionGenerator.GeneratePacket(); packet != nil {
			select {
			case bs.packetChan <- packet:
			default:
				bs.logger.Warn("Packet channel full, dropping protection packet")
			}
		}
	}
}

func (bs *BoardSimulator) packetSender() {
	for {
		select {
		case <-bs.ctx.Done():
			return
		case packet := <-bs.packetChan:
			bs.sendPacket(packet)
		}
	}
}

func (bs *BoardSimulator) writePacketTCP(packet []byte) error {
	bs.connMutex.RLock()
	defer bs.connMutex.RUnlock()
	
	if !bs.tcpConnected || bs.tcpConn == nil {
		return fmt.Errorf("TCP not connected")
	}
	
	// Recover from any panics that might occur during write
	defer func() {
		if r := recover(); r != nil {
			bs.logger.Warn("Panic during TCP write to %s: %v", bs.board.Name, r)
		}
	}()
	
	_, err := bs.tcpConn.Write(packet)
	return err
}

func (bs *BoardSimulator) writePacketUDP(packet []byte) error {
	bs.connMutex.RLock()
	defer bs.connMutex.RUnlock()
	
	if !bs.udpConnected || bs.udpConn == nil || bs.udpAddr == nil {
		return fmt.Errorf("UDP not connected")
	}
	
	// Recover from any panics that might occur during write
	defer func() {
		if r := recover(); r != nil {
			bs.logger.Warn("Panic during UDP write to %s: %v", bs.board.Name, r)
		}
	}()
	
	// Use WriteTo for unconnected UDP socket (pcap compatibility)
	n, err := bs.udpConn.WriteTo(packet, bs.udpAddr)
	if err != nil {
		bs.logger.Error("Failed to send UDP packet to %s: %v", bs.udpAddr, err)
	} else if n != len(packet) {
		bs.logger.Warn("UDP packet partially sent to %s: %d/%d bytes", bs.udpAddr, n, len(packet))
	} else {
		bs.logger.Debug("Sent UDP packet to %s: %d bytes", bs.udpAddr, n)
	}
	return err
}

func (bs *BoardSimulator) sendPacket(packet []byte) {
	if len(packet) < 2 {
		bs.logger.Warn("Invalid packet size: %d", len(packet))
		return
	}
	
	packetID := binary.LittleEndian.Uint16(packet[:2])
	packetType := bs.getPacketType(packetID)
	start := time.Now()
	
	// Route packet based on type
	var err error
	if packetType == "protection" {
		// Protection packets go over TCP
		err = bs.writePacketTCP(packet)
	} else {
		// Data, state, order packets go over UDP
		err = bs.writePacketUDP(packet)
	}
	
	stat := PacketStat{
		BoardID:    bs.board.Name,
		PacketID:   packetID,
		PacketType: packetType,
		Size:       len(packet),
		Timestamp:  start,
		Success:    err == nil,
		Error:      err,
	}
	
	select {
	case bs.statsChan <- stat:
	default:
		// Stats channel full, drop stat
	}
	
	if err != nil {
		bs.logger.Debug("Failed to send %s packet %d from board %s: %v", packetType, packetID, bs.board.Name, err)
		
		// Handle connection failures based on protocol
		if packetType == "protection" {
			bs.safeCloseTCPConnection()
		} else {
			bs.safeCloseUDPConnection()
		}
	} else {
		bs.logger.Debug("Sent %s packet %d from board %s (%d bytes)", packetType, packetID, bs.board.Name, len(packet))
	}
}

func (bs *BoardSimulator) getPacketType(packetID uint16) string {
	// Look up packet type based on ID
	for _, packet := range bs.board.Packets {
		if packet.Id == packetID {
			return packet.Type
		}
	}
	return "unknown"
}

func (bs *BoardSimulator) SendCustomPacket(packetType string, data map[string]interface{}) error {
	var packet []byte
	var err error
	
	switch packetType {
	case "data":
		packet, err = bs.dataGenerator.GenerateCustomPacket(data)
	case "protection":
		packet, err = bs.protectionGenerator.GenerateCustomPacket(data)
	case "state":
		packet, err = bs.stateGenerator.GenerateCustomPacket(data)
	case "order":
		packet, err = bs.orderGenerator.GenerateCustomPacket(data)
	default:
		return fmt.Errorf("unknown packet type: %s", packetType)
	}
	
	if err != nil {
		return fmt.Errorf("failed to generate custom packet: %w", err)
	}
	
	select {
	case bs.packetChan <- packet:
		return nil
	default:
		return fmt.Errorf("packet channel full")
	}
}

func (bs *BoardSimulator) GetBoardName() string {
	return bs.board.Name
}

func (bs *BoardSimulator) GetBoard() adj_module.Board {
	return bs.board
}

// SendPacket sends a raw packet through the simulator
func (bs *BoardSimulator) SendPacket(packet []byte) error {
	select {
	case bs.packetChan <- packet:
		return nil
	case <-time.After(time.Second):
		return fmt.Errorf("timeout sending packet")
	}
}