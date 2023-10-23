package network

import (
	"net"

	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
)

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

func NewSniffer() Sniffer {
	return Sniffer{}
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
