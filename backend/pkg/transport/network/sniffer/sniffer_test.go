package sniffer_test

import (
	"io"
	"testing"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/sniffer"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
	"github.com/rs/zerolog"
)

const (
	SnifferCap    = "../../../../captures/telnet.cap"
	SnifferFilter = "tcp port 23 and (((ip[2:2] - ((ip[0]&0xf)<<2)) - ((tcp[12]&0xf0)>>2)) != 0)"
)

func TestSniffer(t *testing.T) {
	type testCase struct {
		name    string
		socket  network.Socket
		payload []byte
	}

	socketA := network.Socket{
		SrcIP:   "192.168.1.140",
		SrcPort: 56760,
		DstIP:   "192.168.1.194",
		DstPort: 23,
	}

	socketB := network.Socket{
		SrcIP:   "192.168.1.194",
		SrcPort: 23,
		DstIP:   "192.168.1.140",
		DstPort: 56760,
	}

	expected := []testCase{
		{"first", socketA, []byte("\xff\xfd\x03\xff\xfb\x18\xff\xfb\x1f\xff\xfb\x20\xff\xfb\x21\xff\xfb\x22\xff\xfb\x27\xff\xfd\x05\xff\xfb\x23")},
		{"second", socketB, []byte("\xff\xfd\x18\xff\xfd\x20\xff\xfd\x23\xff\xfd\x27")},
		{"third", socketB, []byte("\xff\xfb\x03\xff\xfd\x1f\xff\xfd\x21\xff\xfe\x22\xff\xfb\x05\xff\xfa\x20\x01\xff\xf0\xff\xfa\x23\x01\xff\xf0\xff\xfa\x27\x01\xff\xf0\xff\xfa\x18\x01\xff\xf0")},
		{"fourth", socketA, []byte("\xff\xfa\x1f\x00\x50\x00\x18\xff\xf0\xff\xfa\x20\x00\x33\x38\x34\x30\x30\x2c\x33\x38\x34\x30\x30\xff\xf0\xff\xfa\x23\x00\x53\x61\x6e\x64\x62\x6f\x78\x3a\x30\x2e\x30\xff\xf0\xff\xfa\x27\x00\x00\x44\x49\x53\x50\x4c\x41\x59\x01\x53\x61\x6e\x64\x62\x6f\x78\x3a\x30\x2e\x30\xff\xf0\xff\xfa\x18\x00\x78\x74\x65\x72\x6d\xff\xf0")},
		{"fifth", socketB, []byte("\xff\xfd\x01")},
		{"sixth", socketA, []byte("\xff\xfc\x01")},
		{"seventh", socketB, []byte("\xff\xfb\x01")},
		{"eigth", socketA, []byte("\xff\xfd\x01")},
		{"ninth", socketB, []byte("\x6c\x6f\x67\x69\x6e\x3a\x20")},
	}
	source, err := pcap.OpenOffline(SnifferCap)
	if err != nil {
		t.Fatalf("error opening source: %s", err)
	}

	err = source.SetBPFFilter(SnifferFilter)
	if err != nil {
		t.Fatalf("error setting filter: %s", err)
	}

	first := layers.LayerTypeEthernet
	nullLogger := zerolog.New(io.Discard)
	sniffer := sniffer.New(source, &first, &nullLogger)
	defer sniffer.Close()

	for _, test := range expected {
		t.Run(test.name, func(t *testing.T) {
			data, err := sniffer.ReadNext()
			if err != nil {
				t.Fatalf("error reading packet: %s", err)
			}

			if data.Socket != test.socket {
				t.Fatalf("returned socket does not match expected (%v != %v)", data.Socket, test.socket)
			}

			if string(data.Data) != string(test.payload) {
				t.Fatalf("returned payload does not match expected (%v != %v)", data.Data, test.payload)
			}
		})
	}
}
