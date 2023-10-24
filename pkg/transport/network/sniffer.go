package network

import (
	"os"

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

// NewOfflineSniffer creates a new sniffer that opens and reads from the specified file.
// When firstLayer is set to nil the program tries to auto detect the link type for the connection, otherwise
// the specified value is used.
func NewOfflineSniffer(file string, firstLayer *gopacket.LayerType) (*Sniffer, error) {
	source, err := pcap.OpenOffline(file)
	if err != nil {
		return nil, err
	}

	first := source.LinkType().LayerType()
	if firstLayer != nil {
		first = *firstLayer
	}

	decoder := newDecoder(first)

	return &Sniffer{
		source:  source,
		decoder: &decoder,
	}, nil
}

// NewOfflineFileSniffer creates a new sniffer that reads from the specified file.
// When firstLayer is set to nil the program tries to auto detect the link type for the connection, otherwise
// the specified value is used.
func NewOfflineFileSniffer(file *os.File, firstLayer *gopacket.LayerType) (*Sniffer, error) {
	source, err := pcap.OpenOfflineFile(file)
	if err != nil {
		return nil, err
	}

	first := source.LinkType().LayerType()
	if firstLayer != nil {
		first = *firstLayer
	}

	decoder := newDecoder(first)

	return &Sniffer{
		source:  source,
		decoder: &decoder,
	}, nil
}

type LiveSnifferOpt func(*pcap.InactiveHandle) error

// NewLiveSniffer creates a new live sniffer capturing packets arriving on the specified device
// When firstLayer is set to nil the program tries to auto detect the link type for the connection, otherwise
// the specified value is used.
// Multiple opts may also be provided, these will apply configuration options to the sniffer before
// creating it.
func NewLiveSniffer(device string, firstLayer *gopacket.LayerType, opts ...LiveSnifferOpt) (*Sniffer, error) {
	handle, err := pcap.NewInactiveHandle(device)
	defer handle.CleanUp()
	if err != nil {
		return nil, err
	}

	for _, opt := range opts {
		if err = opt(handle); err != nil {
			return nil, err
		}
	}

	source, err := handle.Activate()
	if err != nil {
		return nil, err
	}

	first := source.LinkType().LayerType()
	if firstLayer != nil {
		first = *firstLayer
	}

	decoder := newDecoder(first)

	return &Sniffer{
		source:  source,
		decoder: &decoder,
	}, nil
}

// Socket defines a unique conversation over a network by using the source and destination
// IP addresses and TCP/UDP ports.
type Socket struct {
	SrcIP   string
	SrcPort uint16
	DstIP   string
	DstPort uint16
}

// ReadNext pulls the next packet from the wire, decodes it and returns the socket it belongs to,
// its TCP or UDP payload and any errors encountered.
func (sniffer *Sniffer) ReadNext() (Socket, []byte, error) {
	data, _, err := sniffer.source.ReadPacketData()
	if err != nil {
		return Socket{}, nil, err
	}

	packetLayers, err := sniffer.decoder.decode(data)
	if err != nil {
		return Socket{}, data, err
	}

	ip := sniffer.decoder.IPv4()

	socket := Socket{
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
		return Socket{}, data, ErrMissingPayload{packetLayers}
	}

	return socket, sniffer.decoder.Payload(), nil
}

// Close closes the underlying packet capture handle and cleans up any left over data.
func (sniffer *Sniffer) Close() {
	sniffer.source.Close()
}
