package sniffer

import (
	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
)

type decoder struct {
	eth     layers.Ethernet
	ipv4    layers.IPv4
	ipipv4  layers.IPv4
	tcp     layers.TCP
	udp     layers.UDP
	payload gopacket.Payload

	parser *gopacket.DecodingLayerParser
}

func newDecoder(first gopacket.LayerType) *decoder {
	dec := new(decoder)
	dec.parser = gopacket.NewDecodingLayerParser(first, &dec.eth, &dec.ipv4, &dec.ipipv4, &dec.tcp, &dec.udp, &dec.payload)
	dec.parser.IgnoreUnsupported = true
	return dec

}

func (dec *decoder) decode(data []byte) ([]gopacket.LayerType, error) {
	decoded := []gopacket.LayerType{}
	err := dec.parser.DecodeLayers(data, &decoded)
	return decoded, err
}

func (dec *decoder) IPv4() layers.IPv4 {
	return dec.ipipv4
}

func (dec *decoder) TCP() layers.TCP {
	return dec.tcp
}

func (dec *decoder) UDP() layers.UDP {
	return dec.udp
}

func (dec *decoder) Payload() []byte {
	return dec.payload
}
