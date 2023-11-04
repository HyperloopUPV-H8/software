package packet_parser

import (
	"bytes"
	"fmt"
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/internal/packet"
	"github.com/HyperloopUPV-H8/h9-backend/internal/vehicle/models"
)

type PacketParser struct {
	structures   map[uint16][]packet.ValueDescriptor
	valueParsers map[string]parser
	config       Config
}

func (parser *PacketParser) Decode(id uint16, raw []byte, metadata packet.Metadata) (models.PacketUpdate, error) {
	structure, ok := parser.structures[id]
	if !ok {
		return models.PacketUpdate{}, fmt.Errorf("structure for packet %d not found", id)
	}

	reader := bytes.NewReader(raw)

	values := make(map[string]packet.Value)
	for _, descriptor := range structure {
		value, err := parser.decodeValue(descriptor, reader)
		if err != nil {
			return models.PacketUpdate{}, err
		}

		values[descriptor.Name] = value
	}

	return models.PacketUpdate{
		Metadata: metadata,
		HexValue: raw,
		Values:   values,
	}, nil
}

func (parser *PacketParser) decodeValue(descriptor packet.ValueDescriptor, reader io.Reader) (packet.Value, error) {
	decoder, ok := parser.valueParsers[descriptor.Type]
	if !ok {
		return nil, fmt.Errorf("decoder for type %s not found", descriptor.Type)
	}

	return decoder.decode(descriptor, parser.config.GetByteOrder(), reader)
}

func (parser *PacketParser) Encode(id uint16, values map[string]packet.Value, writer io.Writer) error {
	structure, ok := parser.structures[id]
	if !ok {
		return fmt.Errorf("structure for packet %d not found", id)
	}

	for _, descriptor := range structure {
		value, ok := values[descriptor.Name]
		if !ok {
			return fmt.Errorf("value for %s not found", descriptor.Name)
		}

		err := parser.encodeValue(descriptor, value, writer)
		if err != nil {
			return err
		}
	}

	return nil
}

func (parser *PacketParser) encodeValue(descriptor packet.ValueDescriptor, value packet.Value, writer io.Writer) error {
	encoder, ok := parser.valueParsers[descriptor.Type]
	if !ok {
		return fmt.Errorf("encoder for type %s not found", descriptor.Type)
	}

	return encoder.encode(descriptor, parser.config.GetByteOrder(), value, writer)
}
