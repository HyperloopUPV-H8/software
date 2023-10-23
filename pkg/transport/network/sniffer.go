package network

import (
	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
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

func NewDecoder(first gopacket.LayerType) *Decoder {
	dec := new(Decoder)
	dec.parser = gopacket.NewDecodingLayerParser(first, &dec.eth, &dec.ipv4, &dec.ipipv4, &dec.tcp, &dec.udp, &dec.payload)
	dec.parser.IgnoreUnsupported = true
	return dec

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
	return decoder.ipv4
}

func (decoder *Decoder) IPIPv4() layers.IPv4 {
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
	LocalIP    string
	LocalPort  uint16
	RemoteIP   string
	RemotePort uint16
}

type Sniffer struct {
}
