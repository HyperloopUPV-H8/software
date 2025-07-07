package udp

import (
	"fmt"
	"net"
	"time"

	"github.com/rs/zerolog"
)

type Packet struct {
	SourceIP   net.IP
	SourcePort uint16
	DestIP     net.IP
	DestPort   uint16
	Payload    []byte
	Timestamp  time.Time
}

type Server struct {
	address   string
	port      uint16
	conn      *net.UDPConn
	logger    *zerolog.Logger
	packetsCh chan Packet
	errorsCh  chan error
	stopCh    chan struct{}
}

func NewServer(address string, port uint16, logger *zerolog.Logger) *Server {
	return &Server{
		address:   address,
		port:      port,
		logger:    logger,
		packetsCh: make(chan Packet, 1000),
		errorsCh:  make(chan error, 100),
		stopCh:    make(chan struct{}),
	}
}

func (s *Server) Start() error {
	addr, err := net.ResolveUDPAddr("udp", fmt.Sprintf("%s:%d", s.address, s.port))
	if err != nil {
		return fmt.Errorf("failed to resolve UDP address: %w", err)
	}

	conn, err := net.ListenUDP("udp", addr)
	if err != nil {
		return fmt.Errorf("failed to listen on UDP: %w", err)
	}
	s.conn = conn

	s.logger.Info().
		Str("address", s.address).
		Uint16("port", s.port).
		Msg("UDP server started")

	go s.readLoop()
	return nil
}

func (s *Server) readLoop() {
	buffer := make([]byte, 65535) // Maximum UDP packet size

	for {
		select {
		case <-s.stopCh:
			return
		default:
			// Set read deadline to allow periodic checking of stop channel
			s.conn.SetReadDeadline(time.Now().Add(100 * time.Millisecond))
			
			n, addr, err := s.conn.ReadFromUDP(buffer)
			if err != nil {
				// Check if it's a timeout error (expected)
				if netErr, ok := err.(net.Error); ok && netErr.Timeout() {
					continue
				}
				s.logger.Error().Err(err).Msg("failed to read UDP packet")
				select {
				case s.errorsCh <- err:
				default:
					// Error channel full, drop error
				}
				continue
			}

			// Create a copy of the packet data
			payload := make([]byte, n)
			copy(payload, buffer[:n])

			packet := Packet{
				SourceIP:   addr.IP,
				SourcePort: uint16(addr.Port),
				DestIP:     net.ParseIP(s.address),
				DestPort:   s.port,
				Payload:    payload,
				Timestamp:  time.Now(),
			}

			s.logger.Debug().
				Str("source", fmt.Sprintf("%s:%d", packet.SourceIP, packet.SourcePort)).
				Str("dest", fmt.Sprintf("%s:%d", packet.DestIP, packet.DestPort)).
				Int("size", len(payload)).
				Msg("received UDP packet")

			select {
			case s.packetsCh <- packet:
			default:
				s.logger.Warn().Msg("packet channel full, dropping packet")
			}
		}
	}
}

func (s *Server) GetPackets() <-chan Packet {
	return s.packetsCh
}

func (s *Server) GetErrors() <-chan error {
	return s.errorsCh
}

func (s *Server) Stop() error {
	close(s.stopCh)
	if s.conn != nil {
		return s.conn.Close()
	}
	return nil
}