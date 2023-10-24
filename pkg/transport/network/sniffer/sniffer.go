package sniffer

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network"
	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
)

// Sniffer provides a way to capture packets from the wire. It handles both capture
// and analysis to provide only the payload of the packets, instead of the raw bytes.
type Sniffer struct {
	source  *pcap.Handle
	decoder *decoder
}

// New creates a new sniffer from the provided source.
//
// source is a previously created pcap handle that will capture packets from the wire or a save file.
//
// firstLayer, when set to something, will be used as the firstLayer for the packet decoder. When this
// value is nil, the program tries to automatically detect the first layer from the source.
//
// opts are a list of options to be applied to the sniffer used to configure the capture options.
func New(source *pcap.Handle, firstLayer *gopacket.LayerType, opts ...options) (*Sniffer, error) {
	first := source.LinkType().LayerType()
	if firstLayer != nil {
		first = *firstLayer
	}
	decoder := newDecoder(first)

	sniffer := &Sniffer{
		source:  source,
		decoder: decoder,
	}

	for _, opt := range opts {
		if err := opt.Apply(sniffer); err != nil {
			return sniffer, err
		}
	}

	return sniffer, nil
}

// ReadNext pulls the next packet from the wire, decodes it and returns the socket it belongs to,
// its TCP or UDP payload and any errors encountered.
func (sniffer *Sniffer) ReadNext() (network.Socket, []byte, error) {
	data, _, err := sniffer.source.ReadPacketData()
	if err != nil {
		return network.Socket{}, nil, err
	}

	packetLayers, err := sniffer.decoder.decode(data)
	if err != nil {
		return network.Socket{}, data, err
	}

	ip := sniffer.decoder.IPv4()

	socket := network.Socket{
		SrcIP:   ip.SrcIP.String(),
		SrcPort: 0,
		DstIP:   ip.DstIP.String(),
		DstPort: 0,
	}

layerLoop:
	for _, layer := range packetLayers {
		switch layer {
		case layers.LayerTypeUDP:
			udp := sniffer.decoder.UDP()
			socket.SrcPort = uint16(udp.SrcPort)
			socket.DstPort = uint16(udp.DstPort)
			break layerLoop
		case layers.LayerTypeTCP:
			tcp := sniffer.decoder.TCP()
			socket.SrcPort = uint16(tcp.SrcPort)
			socket.DstPort = uint16(tcp.DstPort)
			break layerLoop
		}
	}

	if socket.SrcPort == 0 && socket.DstPort == 0 {
		return network.Socket{}, data, ErrMissingPayload{packetLayers}
	}

	return socket, sniffer.decoder.Payload(), nil
}

// Close closes the underlying packet capture handle and cleans up any left over data.
func (sniffer *Sniffer) Close() {
	sniffer.source.Close()
}
