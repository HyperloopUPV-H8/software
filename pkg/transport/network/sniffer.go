package network

import (
	"net"
	"os"

	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
)

type Socket struct {
	SrcIP   net.IP
	SrcPort uint16
	DstIP   net.IP
	DstPort uint16
}

type Sniffer struct {
	source  *pcap.Handle
	decoder *Decoder
}

// NewOfflineSniffer creates a new sniffer that opens and reads from the specified file.
// Since this does not provide a way to auto detect the packets first layer, the caller
// should manually provide the first layer to be decoded (usualy layers.LayerTypeEthernet).
func NewOfflineSniffer(file string, firstLayer gopacket.LayerType) (*Sniffer, error) {
	source, err := pcap.OpenOffline(file)
	if err != nil {
		return nil, err
	}

	decoder := NewDecoder(firstLayer)

	return &Sniffer{
		source:  source,
		decoder: &decoder,
	}, nil
}

// NewOfflineFileSniffer creates a new sniffer that reads from the specified file.
// Since this does not provide a way to auto detect the packets first layer, the caller
// should manually provide the first layer to be decoded (usualy layers.LayerTypeEthernet).
func NewOfflineFileSniffer(file *os.File, firstLayer gopacket.LayerType) (*Sniffer, error) {
	source, err := pcap.OpenOfflineFile(file)
	if err != nil {
		return nil, err
	}

	decoder := NewDecoder(firstLayer)

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

	decoder := NewDecoder(first)

	return &Sniffer{
		source:  source,
		decoder: &decoder,
	}, nil
}

func (sniffer *Sniffer) ReadNext() (Socket, []byte, error) {
	data, _, err := sniffer.source.ReadPacketData()
	if err != nil {
		return Socket{}, nil, err
	}

	packetLayers, err := sniffer.decoder.Decode(data)
	if err != nil {
		return Socket{}, data, err
	}

	ip := sniffer.decoder.IPv4()

	socket := Socket{
		SrcIP:   ip.SrcIP,
		SrcPort: 0,
		DstIP:   ip.DstIP,
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

type Decoder struct {
	eth     layers.Ethernet
	ipv4    layers.IPv4
	ipipv4  layers.IPv4
	tcp     layers.TCP
	udp     layers.UDP
	payload gopacket.Payload

	parser *gopacket.DecodingLayerParser
}

func NewDecoder(first gopacket.LayerType) Decoder {
	dec := new(Decoder)
	dec.parser = gopacket.NewDecodingLayerParser(first, &dec.eth, &dec.ipv4, &dec.ipipv4, &dec.tcp, &dec.udp, &dec.payload)
	dec.parser.IgnoreUnsupported = true
	return *dec

}

func (decoder *Decoder) Decode(data []byte) ([]gopacket.LayerType, error) {
	decoded := []gopacket.LayerType{}
	err := decoder.parser.DecodeLayers(data, &decoded)
	return decoded, err
}

func (decoder *Decoder) Eth() layers.Ethernet {
	return decoder.eth
}

func (decoder *Decoder) IPv4() layers.IPv4 {
	return decoder.ipipv4
}

func (decoder *Decoder) TCP() layers.TCP {
	return decoder.tcp
}

func (decoder *Decoder) UDP() layers.UDP {
	return decoder.udp
}

func (decoder *Decoder) Payload() []byte {
	return decoder.payload
}
