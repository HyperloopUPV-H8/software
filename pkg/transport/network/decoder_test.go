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
	IPCap     = "../../../captures/path_MTU_discovery.cap"
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

			ip := decoder.IPv4()

			if ip.SrcIP.String() != test.lip {
				t.Fatalf("source IPIP for the packet is different (%s != %s)", ip.SrcIP, test.lip)
			}

			if ip.DstIP.String() != test.rip {
				t.Fatalf("destination IPIP for the packet is different (%s != %s)", ip.DstIP, test.rip)
			}
		})
	}
}

func TestIP(t *testing.T) {
	type testCase struct {
		name string
		lip  string
		rip  string
	}

	expected := []testCase{
		{"first", "192.168.0.2", "192.168.1.2"},
		{"second", "192.168.0.1", "192.168.0.2"},
		{"third", "192.168.0.2", "192.168.1.2"},
		{"fourth", "192.168.0.1", "192.168.0.2"},
		{"fifth", "192.168.0.2", "192.168.1.2"},
		{"sixth", "192.168.0.1", "192.168.0.2"},
		{"seventh", "192.168.0.2", "192.168.1.2"},
		{"eight", "192.168.1.2", "192.168.0.2"},
	}

	source, err := pcap.OpenOffline(IPCap)
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

			ip := decoder.IPv4()

			if ip.SrcIP.String() != test.lip {
				t.Fatalf("source IP for the packet is different (%s != %s)", ip.SrcIP, test.lip)
			}

			if ip.DstIP.String() != test.rip {
				t.Fatalf("destination IP for the packet is different (%s != %s)", ip.DstIP, test.rip)
			}
		})
	}
}
