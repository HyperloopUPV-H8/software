package simulator

import (
	"bytes"
	"encoding/binary"
	"fmt"
	"math"
	"math/rand"
	"strings"
	"time"

	adj_module "github.com/HyperloopUPV-H8/h9-backend/pkg/adj"
)

type DataPacketGenerator struct {
	board      adj_module.Board
	logger     Logger
	packets    []adj_module.Packet
	lastSent   map[uint16]time.Time
	sinePhase  map[string]float64
	enumStates map[string]int
}

func NewDataPacketGenerator(board adj_module.Board, logger Logger) *DataPacketGenerator {
	dpg := &DataPacketGenerator{
		board:      board,
		logger:     logger,
		packets:    make([]adj_module.Packet, 0),
		lastSent:   make(map[uint16]time.Time),
		sinePhase:  make(map[string]float64),
		enumStates: make(map[string]int),
	}
	
	// Filter data packets
	for _, packet := range board.Packets {
		if packet.Type == "data" {
			dpg.packets = append(dpg.packets, packet)
		}
	}
	
	return dpg
}

func (dpg *DataPacketGenerator) GeneratePacket() []byte {
	if len(dpg.packets) == 0 {
		return nil
	}
	
	// Select a random packet or use round-robin
	packet := dpg.packets[rand.Intn(len(dpg.packets))]
	
	// Check if we should send this packet based on timing
	if lastSent, exists := dpg.lastSent[packet.Id]; exists {
		if time.Since(lastSent) < 100*time.Millisecond {
			return nil // Too soon to send again
		}
	}
	
	data, err := dpg.generatePacketData(packet)
	if err != nil {
		dpg.logger.Error("Failed to generate data packet %d: %v", packet.Id, err)
		return nil
	}
	
	dpg.lastSent[packet.Id] = time.Now()
	return data
}

func (dpg *DataPacketGenerator) generatePacketData(packet adj_module.Packet) ([]byte, error) {
	if len(packet.Variables) == 0 {
		return nil, fmt.Errorf("packet %d has no variables", packet.Id)
	}
	
	buf := bytes.NewBuffer(make([]byte, 0, 256))
	
	// Write packet ID
	if err := binary.Write(buf, binary.LittleEndian, packet.Id); err != nil {
		return nil, fmt.Errorf("failed to write packet ID: %w", err)
	}
	
	// Write variables
	for _, variable := range packet.Variables {
		if err := dpg.writeVariable(buf, variable); err != nil {
			return nil, fmt.Errorf("failed to write variable %s: %w", variable.Name, err)
		}
	}
	
	return buf.Bytes(), nil
}

func (dpg *DataPacketGenerator) writeVariable(buf *bytes.Buffer, variable adj_module.Measurement) error {
	switch {
	case strings.Contains(variable.Type, "enum"):
		return dpg.writeEnumVariable(buf, variable)
	case variable.Type == "bool":
		return dpg.writeBoolVariable(buf, variable)
	case variable.Type == "string":
		return dpg.writeStringVariable(buf, variable)
	default:
		return dpg.writeNumericVariable(buf, variable)
	}
}

func (dpg *DataPacketGenerator) writeEnumVariable(buf *bytes.Buffer, variable adj_module.Measurement) error {
	enumValues := dpg.parseEnumValues(variable.Type)
	if len(enumValues) == 0 {
		return binary.Write(buf, binary.LittleEndian, uint8(0))
	}
	
	// Get or initialize enum state
	key := fmt.Sprintf("%s_%s", dpg.board.Name, variable.Name)
	currentState, exists := dpg.enumStates[key]
	if !exists {
		currentState = 0
		dpg.enumStates[key] = currentState
	}
	
	// Occasionally change enum state (10% chance)
	if rand.Float64() < 0.1 {
		currentState = rand.Intn(len(enumValues))
		dpg.enumStates[key] = currentState
	}
	
	return binary.Write(buf, binary.LittleEndian, uint8(currentState))
}

func (dpg *DataPacketGenerator) writeBoolVariable(buf *bytes.Buffer, variable adj_module.Measurement) error {
	// Generate realistic boolean patterns
	value := rand.Float64() < 0.3 // 30% chance of true
	return binary.Write(buf, binary.LittleEndian, value)
}

func (dpg *DataPacketGenerator) writeStringVariable(buf *bytes.Buffer, variable adj_module.Measurement) error {
	// For now, skip string variables as they're complex to handle
	return nil
}

func (dpg *DataPacketGenerator) writeNumericVariable(buf *bytes.Buffer, variable adj_module.Measurement) error {
	value := dpg.generateNumericValue(variable)
	return dpg.writeNumericValue(buf, value, variable.Type)
}

func (dpg *DataPacketGenerator) generateNumericValue(variable adj_module.Measurement) float64 {
	// Use sine wave for smoother data
	key := fmt.Sprintf("%s_%s", dpg.board.Name, variable.Name)
	phase, exists := dpg.sinePhase[key]
	if !exists {
		phase = rand.Float64() * 2 * math.Pi
		dpg.sinePhase[key] = phase
	}
	
	// Increment phase for next time
	dpg.sinePhase[key] = phase + 0.1
	
	// Generate base sine value
	sineValue := math.Sin(phase)
	
	// Map to appropriate range
	var minVal, maxVal float64
	if len(variable.SafeRange) == 2 && variable.SafeRange[0] != nil && variable.SafeRange[1] != nil {
		minVal = *variable.SafeRange[0]
		maxVal = *variable.SafeRange[1]
	} else if len(variable.WarningRange) == 2 && variable.WarningRange[0] != nil && variable.WarningRange[1] != nil {
		minVal = *variable.WarningRange[0]
		maxVal = *variable.WarningRange[1]
	} else {
		// Use type limits
		minVal, maxVal = dpg.getTypeLimits(variable.Type)
	}
	
	// Add some noise
	noise := (rand.Float64() - 0.5) * 0.1
	normalizedValue := (sineValue + noise + 1) / 2 // Normalize to [0, 1]
	
	return minVal + normalizedValue*(maxVal-minVal)
}

func (dpg *DataPacketGenerator) getTypeLimits(varType string) (float64, float64) {
	switch varType {
	case "uint8":
		return 0, 255
	case "uint16":
		return 0, 65535
	case "uint32":
		return 0, 4294967295
	case "uint64":
		return 0, 18446744073709551615
	case "int8":
		return -128, 127
	case "int16":
		return -32768, 32767
	case "int32":
		return -2147483648, 2147483647
	case "int64":
		return -9223372036854775808, 9223372036854775807
	case "float32":
		return -3.4e38, 3.4e38
	case "float64":
		return -1.7e308, 1.7e308
	default:
		return 0, 100
	}
}

func (dpg *DataPacketGenerator) writeNumericValue(buf *bytes.Buffer, value float64, varType string) error {
	switch varType {
	case "uint8":
		return binary.Write(buf, binary.LittleEndian, uint8(value))
	case "uint16":
		return binary.Write(buf, binary.LittleEndian, uint16(value))
	case "uint32":
		return binary.Write(buf, binary.LittleEndian, uint32(value))
	case "uint64":
		return binary.Write(buf, binary.LittleEndian, uint64(value))
	case "int8":
		return binary.Write(buf, binary.LittleEndian, int8(value))
	case "int16":
		return binary.Write(buf, binary.LittleEndian, int16(value))
	case "int32":
		return binary.Write(buf, binary.LittleEndian, int32(value))
	case "int64":
		return binary.Write(buf, binary.LittleEndian, int64(value))
	case "float32":
		return binary.Write(buf, binary.LittleEndian, float32(value))
	case "float64":
		return binary.Write(buf, binary.LittleEndian, value)
	case "bool":
		return binary.Write(buf, binary.LittleEndian, value != 0)
	default:
		return binary.Write(buf, binary.LittleEndian, uint8(value))
	}
}

func (dpg *DataPacketGenerator) parseEnumValues(enumType string) []string {
	// Parse enum(value1,value2,value3) format
	if !strings.HasPrefix(enumType, "enum(") || !strings.HasSuffix(enumType, ")") {
		return nil
	}
	
	content := strings.TrimSuffix(strings.TrimPrefix(enumType, "enum("), ")")
	content = strings.ReplaceAll(content, " ", "")
	
	if content == "" {
		return nil
	}
	
	return strings.Split(content, ",")
}

func (dpg *DataPacketGenerator) GenerateCustomPacket(data map[string]interface{}) ([]byte, error) {
	packetIDInt, ok := data["packet_id"].(int)
	if !ok {
		return nil, fmt.Errorf("packet_id is required")
	}
	packetID := uint16(packetIDInt)
	
	// Find the packet definition
	var targetPacket *adj_module.Packet
	for _, packet := range dpg.packets {
		if packet.Id == packetID {
			targetPacket = &packet
			break
		}
	}
	
	if targetPacket == nil {
		return nil, fmt.Errorf("packet ID %d not found", packetID)
	}
	
	buf := bytes.NewBuffer(make([]byte, 0, 256))
	
	// Write packet ID
	if err := binary.Write(buf, binary.LittleEndian, packetID); err != nil {
		return nil, fmt.Errorf("failed to write packet ID: %w", err)
	}
	
	// Write variables with custom values
	for _, variable := range targetPacket.Variables {
		customValue, hasCustom := data[variable.Name]
		if hasCustom {
			if err := dpg.writeCustomValue(buf, customValue, variable); err != nil {
				return nil, fmt.Errorf("failed to write custom variable %s: %w", variable.Name, err)
			}
		} else {
			if err := dpg.writeVariable(buf, variable); err != nil {
				return nil, fmt.Errorf("failed to write variable %s: %w", variable.Name, err)
			}
		}
	}
	
	return buf.Bytes(), nil
}

func (dpg *DataPacketGenerator) writeCustomValue(buf *bytes.Buffer, value interface{}, variable adj_module.Measurement) error {
	switch variable.Type {
	case "bool":
		boolVal, ok := value.(bool)
		if !ok {
			return fmt.Errorf("expected bool for variable %s", variable.Name)
		}
		return binary.Write(buf, binary.LittleEndian, boolVal)
	case "uint8":
		floatVal, ok := value.(float64)
		if !ok {
			return fmt.Errorf("expected number for variable %s", variable.Name)
		}
		return binary.Write(buf, binary.LittleEndian, uint8(floatVal))
	case "uint16":
		floatVal, ok := value.(float64)
		if !ok {
			return fmt.Errorf("expected number for variable %s", variable.Name)
		}
		return binary.Write(buf, binary.LittleEndian, uint16(floatVal))
	case "uint32":
		floatVal, ok := value.(float64)
		if !ok {
			return fmt.Errorf("expected number for variable %s", variable.Name)
		}
		return binary.Write(buf, binary.LittleEndian, uint32(floatVal))
	case "uint64":
		floatVal, ok := value.(float64)
		if !ok {
			return fmt.Errorf("expected number for variable %s", variable.Name)
		}
		return binary.Write(buf, binary.LittleEndian, uint64(floatVal))
	case "int8":
		floatVal, ok := value.(float64)
		if !ok {
			return fmt.Errorf("expected number for variable %s", variable.Name)
		}
		return binary.Write(buf, binary.LittleEndian, int8(floatVal))
	case "int16":
		floatVal, ok := value.(float64)
		if !ok {
			return fmt.Errorf("expected number for variable %s", variable.Name)
		}
		return binary.Write(buf, binary.LittleEndian, int16(floatVal))
	case "int32":
		floatVal, ok := value.(float64)
		if !ok {
			return fmt.Errorf("expected number for variable %s", variable.Name)
		}
		return binary.Write(buf, binary.LittleEndian, int32(floatVal))
	case "int64":
		floatVal, ok := value.(float64)
		if !ok {
			return fmt.Errorf("expected number for variable %s", variable.Name)
		}
		return binary.Write(buf, binary.LittleEndian, int64(floatVal))
	case "float32":
		floatVal, ok := value.(float64)
		if !ok {
			return fmt.Errorf("expected number for variable %s", variable.Name)
		}
		return binary.Write(buf, binary.LittleEndian, float32(floatVal))
	case "float64":
		floatVal, ok := value.(float64)
		if !ok {
			return fmt.Errorf("expected number for variable %s", variable.Name)
		}
		return binary.Write(buf, binary.LittleEndian, floatVal)
	default:
		if strings.Contains(variable.Type, "enum") {
			enumVal, ok := value.(string)
			if !ok {
				return fmt.Errorf("expected string for enum variable %s", variable.Name)
			}
			enumValues := dpg.parseEnumValues(variable.Type)
			for i, enumValue := range enumValues {
				if enumValue == enumVal {
					return binary.Write(buf, binary.LittleEndian, uint8(i))
				}
			}
			return fmt.Errorf("enum value %s not found for variable %s", enumVal, variable.Name)
		}
		return fmt.Errorf("unsupported type %s for variable %s", variable.Type, variable.Name)
	}
}

func (dpg *DataPacketGenerator) GetAvailablePackets() []adj_module.Packet {
	return dpg.packets
}

func (dpg *DataPacketGenerator) GetPacketVariables(packetID uint16) []adj_module.Measurement {
	for _, packet := range dpg.packets {
		if packet.Id == packetID {
			return packet.Variables
		}
	}
	return nil
}