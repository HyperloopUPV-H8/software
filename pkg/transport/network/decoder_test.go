package network_test

import (
	"log"
	"testing"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
)

const (
	IPinIPCap = "../../../captures/IP_in_IP.cap"
)

// TestIPinIP checks that the decoder understand IPIP encapsulated packets, returning the address of the
// encapsulated header.
func TestIPinIP(t *testing.T) {
	type testCase struct {
		name string
		lip  string
		rip  string
	}

	expected := []testCase{
		{"first", "1.1.1.1", "2.2.2.2"},
		{"second", "2.2.2.2", "1.1.1.1"},
		{"third", "1.1.1.1", "2.2.2.2"},
		{"fourth", "2.2.2.2", "1.1.1.1"},
		{"fifth", "1.1.1.1", "2.2.2.2"},
		{"sixth", "2.2.2.2", "1.1.1.1"},
		{"seventh", "1.1.1.1", "2.2.2.2"},
		{"eight", "2.2.2.2", "1.1.1.1"},
		{"ninth", "1.1.1.1", "2.2.2.2"},
		{"tenth", "2.2.2.2", "1.1.1.1"},
	}

	source, err := pcap.OpenOffline(IPinIPCap)
	if err != nil {
		t.Fatalf("error opening capture: %s", err)
	}

	decoder := network.NewDecoder(layers.LayerTypeEthernet)

	for _, test := range expected {
		t.Run(test.name, func(t *testing.T) {
			data, _, err := source.ReadPacketData()
			if err != nil {
				t.Fatalf("error reading packet: %s", err)
			}

			layers, err := decoder.Decode(data)
			if err != nil {
				t.Fatalf("error decoding packet: %s", err)
			}

			log.Printf("%v\n", layers)

			ipip := decoder.IPIPv4()

			if ipip.SrcIP.String() != test.lip {
				t.Fatalf("source IPIP for the packet is different (%s != %s)", ipip.SrcIP, test.lip)
			}

			if ipip.DstIP.String() != test.rip {
				t.Fatalf("destination IPIP for the packet is different (%s != %s)", ipip.DstIP, test.rip)
			}
		})
	}

}
