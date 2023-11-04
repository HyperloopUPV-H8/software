package vehicle

import (
	"fmt"
	"io"
)

type BitarrayParser struct {
	names map[uint16][]string
}

func NewBitarrayParser(names map[uint16][]string) BitarrayParser {
	return BitarrayParser{
		names: names,
	}
}

func (parser *BitarrayParser) Decode(id uint16, data io.Reader) (map[string]bool, error) {
	name, ok := parser.names[id]
	if !ok {
		return nil, fmt.Errorf("value count for packet %d not found", id)
	}

	return parser.decodeBitarray(name, data)
}

func (decoder *BitarrayParser) decodeBitarray(names []string, data io.Reader) (map[string]bool, error) {
	buf := make([]byte, (len(names)/8)+1)
	n, err := data.Read(buf)
	if err != nil {
		return nil, err
	}

	if n != len(buf) {
		return nil, fmt.Errorf("invalid bitarray length %d/%d", n, len(buf))
	}

	return zip(names, readBits(buf)), nil
}

func readBits(buf []byte) []bool {
	bits := make([]bool, 0, len(buf))
	for _, b := range buf {
		for j := 0; j < 8; j++ {
			// TODO: test if this is the correct implementation
			bits = append(bits, (b&(0b10000000>>j)) != 0)
		}
	}
	return bits
}

func zip[K comparable, V any](keys []K, values []V) map[K]V {
	m := make(map[K]V, len(keys))
	for i, k := range keys {
		m[k] = values[i]
	}
	return m
}

func (parser *BitarrayParser) Encode(id uint16, enabled map[string]bool, data io.Writer) error {
	names, ok := parser.names[id]
	if !ok {
		return fmt.Errorf("value names for packet %d not found", id)
	}

	if len(names) == 0 {
		return nil
	}

	if len(enabled) != len(names) {
		return fmt.Errorf("invalid value count %d/%d", len(enabled), len(names))
	}

	return parser.encodeBitarray(enabled, data)
}

func (encoder *BitarrayParser) encodeBitarray(nameToEnable map[string]bool, data io.Writer) error {
	buf := writeBits(nameToEnable)

	n, err := data.Write(buf)
	if err != nil {
		return err
	}

	if n != len(buf) {
		return fmt.Errorf("invalid bitarray length %d/%d", n, len(buf))
	}

	return nil
}

func writeBits(nameToEnable map[string]bool) []byte {
	buf := make([]byte, (len(nameToEnable)/8)+1)
	i := 0
	for _, enabled := range nameToEnable {
		if enabled {
			buf[i/8] |= 0b10000000 >> (i % 8)
		}
		i++
	}
	return buf
}
