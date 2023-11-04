package packet_parser

import (
	"strings"

	"github.com/HyperloopUPV-H8/h9-backend/internal/info"
	"github.com/HyperloopUPV-H8/h9-backend/internal/packet"
	"github.com/HyperloopUPV-H8/h9-backend/internal/pod_data"
	"github.com/rs/zerolog"
)

func CreatePacketParser(info info.Info, boards []pod_data.Board, trace zerolog.Logger) (PacketParser, error) {
	structures, err := getStructures(info, boards)
	if err != nil {
		return PacketParser{}, err
	}

	return newPacketParser(structures, getEnumDescriptors(info, boards)), nil
}

func newPacketParser(structures map[uint16][]packet.ValueDescriptor, enums map[string][]string) PacketParser {
	return PacketParser{
		structures: structures,
		valueParsers: map[string]parser{
			"uint8":   numericParser[uint8]{},
			"uint16":  numericParser[uint16]{},
			"uint32":  numericParser[uint32]{},
			"uint64":  numericParser[uint64]{},
			"int8":    numericParser[int8]{},
			"int16":   numericParser[int16]{},
			"int32":   numericParser[int32]{},
			"int64":   numericParser[int64]{},
			"float32": numericParser[float32]{},
			"float64": numericParser[float64]{},
			"bool":    booleanParser{},
			"enum":    enumParser{descriptors: enums},
		},
	}
}

func getStructures(info info.Info, boards []pod_data.Board) (map[uint16][]packet.ValueDescriptor, error) {
	structures := make(map[uint16][]packet.ValueDescriptor)
	for _, board := range boards {
		for _, packet := range board.Packets {
			if packet.Type == "data" || packet.Type == "order" || packet.Type == "stateOrder" {
				structures[packet.Id] = getDescriptor(packet.Measurements)
			}
		}
	}
	return structures, nil
}

func getDescriptor(measurements []pod_data.Measurement) []packet.ValueDescriptor {
	descriptor := make([]packet.ValueDescriptor, len(measurements))
	for i, meas := range measurements {
		descriptor[i] = packet.ValueDescriptor{
			Name: meas.GetId(),
			Type: getValueType(meas.GetType()),
		}
	}
	return descriptor
}

func getValueType(literal string) string {
	if strings.HasPrefix(literal, "enum") {
		return "enum"
	} else {
		return literal
	}
}

func getEnumDescriptors(info info.Info, boards []pod_data.Board) map[string][]string {
	enums := make(map[string][]string)
	for _, board := range boards {
		for _, packet := range board.Packets {
			for _, meas := range packet.Measurements {
				if enumMeas, ok := meas.(pod_data.EnumMeasurement); ok {
					enums[enumMeas.Id] = enumMeas.Options
				}
			}
		}
	}
	return enums
}
