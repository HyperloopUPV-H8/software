package sniffer

import (
	"fmt"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network"
	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
	"github.com/rs/zerolog"
)

// Sniffer provides a way to capture packets from the wire. It handles both capture
// and analysis to provide only the payload of the packets, instead of the raw bytes.
type Sniffer struct {
	source  *pcap.Handle
	decoder *decoder

	logger zerolog.Logger
}

// New creates a new sniffer from the provided source.
//
// source is a previously created pcap handle that will capture packets from the wire or a save file.
//
// firstLayer, when set to something, will be used as the firstLayer for the packet decoder. When this
// value is nil, the program tries to automatically detect the first layer from the source.
//
// The provided source should be already configured and ready to use, with the appropiate filters.
func New(source *pcap.Handle, firstLayer *gopacket.LayerType, baseLogger zerolog.Logger) *Sniffer {
	first := source.LinkType().LayerType()
	if firstLayer != nil {
		first = *firstLayer
	}
	decoder := newDecoder(first)

	logger := baseLogger.Sample(zerolog.LevelSampler{
		TraceSampler: zerolog.RandomSampler(50000),
		DebugSampler: zerolog.RandomSampler(25000),
		InfoSampler:  zerolog.RandomSampler(1),
		WarnSampler:  zerolog.RandomSampler(1),
		ErrorSampler: zerolog.RandomSampler(1),
	})

	sniffer := &Sniffer{
		source:  source,
		decoder: decoder,

		logger: logger,
	}

	return sniffer
}

// ReadNext pulls the next packet from the wire, decodes it and returns the payload obtained.
func (sniffer *Sniffer) ReadNext() (network.Payload, error) {
	data, captureInfo, err := sniffer.source.ReadPacketData()
	if err != nil {
		sniffer.logger.Error().Stack().Err(err).Msg("read source")
		return network.Payload{}, err
	}

	packetLayers, err := sniffer.decoder.decode(data)
	if err != nil {
		sniffer.logger.Error().Stack().Err(err).Msg("decode layers")
		return network.Payload{}, err
	}

	socket := network.Socket{
		SrcIP:   "",
		SrcPort: 0,
		DstIP:   "",
		DstPort: 0,
	}

	gotPorts := false
	gotIp := false
	layerArr := zerolog.Arr()
	for _, layer := range packetLayers {
		if !gotIp && layer == layers.LayerTypeIPv4 {
			ip := sniffer.decoder.IPv4()
			socket.SrcIP = ip.SrcIP.String()
			socket.DstIP = ip.DstIP.String()
			gotIp = true
		} else if !gotPorts {
			switch layer {
			case layers.LayerTypeUDP:
				udp := sniffer.decoder.UDP()
				socket.SrcPort = uint16(udp.SrcPort)
				socket.DstPort = uint16(udp.DstPort)
				gotPorts = true
				// case layers.LayerTypeTCP:
				// 	tcp := sniffer.decoder.TCP()
				// 	socket.SrcPort = uint16(tcp.SrcPort)
				// 	socket.DstPort = uint16(tcp.DstPort)
				// 	gotPorts = true
			}
		}

		layerArr = layerArr.Str(layer.String())
	}

	if !gotIp || !gotPorts {
		sniffer.logger.Debug().Array(
			"layers", layerArr,
		).Bool(
			"has ip", gotIp,
		).Bool(
			"has ports", gotPorts,
		).Msg("missing layers")
		return network.Payload{}, ErrMissingLayers{packetLayers}
	}

	sniffer.logger.Debug().Array(
		"layers", layerArr,
	).Str(
		"from", fmt.Sprintf("%s:%d", socket.SrcIP, socket.SrcPort),
	).Str(
		"to", fmt.Sprintf("%s:%d", socket.DstIP, socket.DstPort),
	).Time(
		"capture", captureInfo.Timestamp,
	).Msg("packet")

	return network.Payload{
		Socket:    socket,
		Data:      sniffer.decoder.Payload(),
		Timestamp: captureInfo.Timestamp,
	}, nil
}

// Close closes the underlying packet capture handle and cleans up any left over data.
func (sniffer *Sniffer) Close() {
	sniffer.logger.Info().Msg("closing")

	sniffer.source.Close()
}
