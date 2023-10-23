package network

import (
	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
)

type Decoder struct {
	eth  layers.Ethernet
	ipv4 layers.IPv4
	tcp  layers.TCP
	udp  layers.UDP

	parser *gopacket.DecodingLayerParser
}

func NewDecoder(first gopacket.LayerType) Decoder {
	decoder := Decoder{}
	decoder.parser = gopacket.NewDecodingLayerParser(first, &decoder.eth, &decoder.ipv4, &decoder.tcp, &decoder.udp)
	return decoder

}

func (decoder *Decoder) Decode(data []byte) ([]gopacket.LayerType, error) {
	decoded := []gopacket.LayerType{}
	err := decoder.parser.DecodeLayers(data, &decoded)
	return decoded, err
}

func (decoder *Decoder) IPv4() layers.IPv4 {
	return decoder.ipv4
}

func (decoder *Decoder) TCP() layers.TCP {
	return decoder.tcp
}

func (decoder *Decoder) UDP() layers.UDP {
	return decoder.udp
}

func (decoder *Decoder) Eth() layers.Ethernet {
	return decoder.eth
}

type Socket struct {
	LocalIP    string
	LocalPort  uint16
	RemoteIP   string
	RemotePort uint16
}

type Sniffer struct {
}
