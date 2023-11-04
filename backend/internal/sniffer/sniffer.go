package sniffer

import (
	"encoding/binary"
	"errors"
	"fmt"
	"net"
	"strings"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/HyperloopUPV-H8/h9-backend/internal/info"
	"github.com/HyperloopUPV-H8/h9-backend/internal/packet"
	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
	"github.com/rs/zerolog"
	trace "github.com/rs/zerolog/log"
)

const SNAPLEN = 1500

type Sniffer struct {
	source *pcap.Handle
	filter string
	config Config
	trace  zerolog.Logger
}

func CreateSniffer(info info.Info, config Config, trace zerolog.Logger) Sniffer {
	ips := common.Values(info.Addresses.Boards)
	filter := getFilter(ips, info.Addresses.Backend, info.Ports.UDP, info.Ports.TcpClient, info.Ports.TcpServer)
	sniffer, err := newSniffer(filter, config)

	if err != nil {
		trace.Fatal().Stack().Err(err).Msg("error creating sniffer")
	}

	return *sniffer
}

func newSniffer(filter string, config Config) (*Sniffer, error) {
	trace.Info().Msg("new sniffer")
	source, err := newSource(config, filter)

	if err != nil {
		trace.Error().Stack().Err(err).Msg("")
		return nil, err
	}

	return &Sniffer{
		source: source,
		filter: filter,
		config: config,
		trace:  trace.With().Str("component", "sniffer").Str("dev", config.Interface).Logger(),
	}, nil
}

func newSource(config Config, filter string) (*pcap.Handle, error) {
	source, err := obtainSource(config.Interface, filter, config.Mtu)

	if err != nil {
		return nil, err
	}

	return source, nil
}

func getFilter(boardAddrs []net.IP, backendAddr net.IP, udpPort uint16, tcpClientPort uint16, tcpServerPort uint16) string {
	ipipFilter := getIPIPfilter()
	udpFilter := getUDPFilter(boardAddrs, udpPort)
	tcpFilter := getTCPFilter(boardAddrs, tcpServerPort, tcpClientPort)
	// noBackend := "not host 192.168.0.9"

	// filter := fmt.Sprintf("((%s) or (%s) or (%s)) and (%s)", ipipFilter, udpFilter, tcpFilter, noBackend)

	filter := fmt.Sprintf("(%s) or (%s) or (%s)", ipipFilter, udpFilter, tcpFilter)

	trace.Trace().Any("addrs", boardAddrs).Str("filter", filter).Msg("new filter")
	return filter
}

func getIPIPfilter() string {
	return "ip[9] == 4"
}

func getUDPFilter(addrs []net.IP, port uint16) string {
	udpPort := fmt.Sprintf("udp port %d", port)
	udpAddrs := common.Map(addrs, func(addr net.IP) string {
		return fmt.Sprintf("(src host %s)", addr)
	})

	udpAddrsStr := strings.Join(udpAddrs, " or ")

	return fmt.Sprintf("(%s) and (%s)", udpPort, udpAddrsStr)
}

func getTCPFilter(addrs []net.IP, serverPort uint16, clientPort uint16) string {
	ports := fmt.Sprintf("tcp port %d or %d", serverPort, clientPort)
	notSynFinRst := "tcp[tcpflags] & (tcp-fin | tcp-syn | tcp-rst) == 0"
	notJustAck := "tcp[tcpflags] | tcp-ack != 16"
	nonZeroPayload := "tcp[tcpflags] & tcp-push != 0"

	srcAddresses := common.Map(addrs, func(addr net.IP) string {
		return fmt.Sprintf("(src host %s)", addr)
	})

	srcAddressesStr := strings.Join(srcAddresses, " or ")

	dstAddresses := common.Map(addrs, func(addr net.IP) string {
		return fmt.Sprintf("(dst host %s)", addr)
	})

	dstAddressesStr := strings.Join(dstAddresses, " or ")

	filter := fmt.Sprintf("(%s) and (%s) and (%s) and (%s) and (%s) and (%s)", ports, notSynFinRst, notJustAck, nonZeroPayload, srcAddressesStr, dstAddressesStr)
	return filter
}

func obtainSource(dev string, filter string, mtu uint) (*pcap.Handle, error) {
	trace.Debug().Str("dev", dev).Str("filter", filter).Msg("obtain source")

	source, err := pcap.OpenLive(dev, int32(mtu), true, pcap.BlockForever)
	if err != nil {
		return nil, err
	}

	if err := source.SetBPFFilter(filter); err != nil {
		return nil, err
	}

	return source, nil
}

func (sniffer *Sniffer) Listen(output chan<- packet.Packet) {
	go sniffer.startReadLoop(output)
}

func (sniffer *Sniffer) startReadLoop(output chan<- packet.Packet) {
	for {
		source, err := newSource(sniffer.config, sniffer.filter)
		if err != nil {
			continue
		}
		sniffer.source = source

		sniffer.trace.Info().Msg("start listening")
		sniffer.read(output)
	}

}

func (sniffer *Sniffer) read(output chan<- packet.Packet) {
	for {
		raw, _, err := sniffer.source.ReadPacketData()
		if err != nil {
			sniffer.trace.Error().Stack().Err(err).Msg("")
			return
		}

		sniffer.trace.Trace().Msg("read")

		packet := gopacket.NewPacket(raw, sniffer.source.LinkType(), gopacket.DecodeOptions{
			NoCopy: true,
		})

		rawPacket, err := sniffer.parseLayers(packet.Layers())
		if err != nil {
			sniffer.trace.Error().Stack().Err(err).Msg("")
			continue
		}

		sniffer.trace.Trace().Msg("parsed")
		output <- rawPacket
	}
}

var syntheticSeqNum uint32 = 0

func (sniffer *Sniffer) parseLayers(packetLayers []gopacket.Layer) (packet.Packet, error) {
	timestamp := time.Now()
	from := ""
	to := ""
	seqNum := syntheticSeqNum
	var payload []byte

layerLoop:
	for _, layer := range packetLayers {
		switch layer := layer.(type) {
		case *layers.IPv4:
			if layer.Protocol == 4 {
				continue layerLoop
			}
			from = layer.SrcIP.String()
			to = layer.DstIP.String()
		case *layers.TCP:
			seqNum = layer.Seq
			payload = layer.Payload
			break layerLoop
		case *layers.UDP:
			syntheticSeqNum++
			payload = layer.Payload
			break layerLoop
		}
	}

	if from == "" || to == "" {
		return packet.Packet{}, errors.New("failed to get flow")
	}

	//Config endianess from config.toml
	if len(payload) < 2 {
		return packet.Packet{}, errors.New("payload smaller than 2")
	}

	id := binary.LittleEndian.Uint16(payload[:2])

	return packet.Packet{
		Metadata: packet.NewMetaData(from, to, id, seqNum, timestamp),
		Payload:  payload[2:],
	}, nil
}
