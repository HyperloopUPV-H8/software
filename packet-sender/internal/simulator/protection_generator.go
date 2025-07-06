package simulator

import (
	"bytes"
	"encoding/binary"
	"fmt"
	"math/rand"
	"time"

	adj_module "github.com/HyperloopUPV-H8/h9-backend/pkg/adj"
	"packet_sender/internal/common"
)

type ProtectionPacketGenerator struct {
	board         adj_module.Board
	logger        Logger
	protectionID  uint16
	lastSent      time.Time
	currentFaults map[string]ProtectionState
	faultTimer    map[string]time.Time
}

type ProtectionState struct {
	Kind     ProtectionKind
	Severity ProtectionSeverity
	Active   bool
	Value    float64
	Bound    float64
}

type ProtectionKind uint8

const (
	BelowKind ProtectionKind = iota
	AboveKind
	OutOfBoundsKind
	EqualsKind
	NotEqualsKind
	ErrorHandlerKind
	TimeAccumulationKind
	WarningKind
)

type ProtectionSeverity uint8

const (
	FaultSeverity ProtectionSeverity = iota
	WarningSeverity
	OkSeverity
)

type ProtectionType uint8

const (
	IntType ProtectionType = iota
	FloatType
	DoubleType
	CharType
	BoolType
	ShortType
	LongType
	Uint8Type
	Uint16Type
	Uint32Type
	Uint64Type
	Int8Type
)

func NewProtectionPacketGenerator(board adj_module.Board, logger Logger) *ProtectionPacketGenerator {
	return &ProtectionPacketGenerator{
		board:         board,
		logger:        logger,
		protectionID:  0x8000, // Start with high ID for protection packets
		currentFaults: make(map[string]ProtectionState),
		faultTimer:    make(map[string]time.Time),
	}
}

func (ppg *ProtectionPacketGenerator) GeneratePacket() []byte {
	// Generate protection packets less frequently than data packets
	if time.Since(ppg.lastSent) < 5*time.Second {
		return nil
	}
	
	// Randomly decide what type of protection to generate
	randVal := rand.Float64()
	
	switch {
	case randVal < 0.1: // 10% chance of generating a fault
		return ppg.generateFaultPacket()
	case randVal < 0.2: // 10% chance of generating a warning
		return ppg.generateWarningPacket()
	case randVal < 0.3: // 10% chance of clearing a fault (OK)
		return ppg.generateOkPacket()
	default:
		return nil // 70% chance of no protection packet
	}
}

func (ppg *ProtectionPacketGenerator) generateFaultPacket() []byte {
	// Select a random measurement that could fault
	dataPackets := ppg.getDataPackets()
	if len(dataPackets) == 0 {
		return nil
	}
	
	packet := dataPackets[rand.Intn(len(dataPackets))]
	if len(packet.Variables) == 0 {
		return nil
	}
	
	variable := packet.Variables[rand.Intn(len(packet.Variables))]
	
	// Create protection based on variable type
	protectionData := ppg.createProtectionData(variable, FaultSeverity)
	if protectionData == nil {
		return nil
	}
	
	// Track the fault
	faultKey := fmt.Sprintf("%s_%s", packet.Name, variable.Name)
	ppg.currentFaults[faultKey] = ProtectionState{
		Kind:     protectionData.Kind,
		Severity: FaultSeverity,
		Active:   true,
		Value:    protectionData.Value,
		Bound:    protectionData.Bound,
	}
	ppg.faultTimer[faultKey] = time.Now()
	
	packetData := ppg.buildProtectionPacket(protectionData, variable.Name)
	ppg.lastSent = time.Now()
	ppg.logger.Info("Generated FAULT protection packet for %s.%s", packet.Name, variable.Name)
	return packetData
}

func (ppg *ProtectionPacketGenerator) generateWarningPacket() []byte {
	dataPackets := ppg.getDataPackets()
	if len(dataPackets) == 0 {
		return nil
	}
	
	packet := dataPackets[rand.Intn(len(dataPackets))]
	if len(packet.Variables) == 0 {
		return nil
	}
	
	variable := packet.Variables[rand.Intn(len(packet.Variables))]
	
	protectionData := ppg.createProtectionData(variable, WarningSeverity)
	if protectionData == nil {
		return nil
	}
	
	packetData := ppg.buildProtectionPacket(protectionData, variable.Name)
	ppg.lastSent = time.Now()
	ppg.logger.Info("Generated WARNING protection packet for %s.%s", packet.Name, variable.Name)
	return packetData
}

func (ppg *ProtectionPacketGenerator) generateOkPacket() []byte {
	// Clear a random active fault
	if len(ppg.currentFaults) == 0 {
		return nil
	}
	
	// Select a random active fault to clear
	var faultKey string
	i := rand.Intn(len(ppg.currentFaults))
	for key := range ppg.currentFaults {
		if i == 0 {
			faultKey = key
			break
		}
		i--
	}
	
	faultState := ppg.currentFaults[faultKey]
	delete(ppg.currentFaults, faultKey)
	delete(ppg.faultTimer, faultKey)
	
	// Create OK protection data
	protectionData := &ProtectionData{
		Kind:     faultState.Kind,
		Severity: OkSeverity,
		Value:    faultState.Value,
		Bound:    faultState.Bound,
	}
	
	packetData := ppg.buildProtectionPacket(protectionData, faultKey)
	ppg.lastSent = time.Now()
	ppg.logger.Info("Generated OK protection packet for %s", faultKey)
	return packetData
}

type ProtectionData struct {
	Kind     ProtectionKind
	Severity ProtectionSeverity
	Value    float64
	Bound    float64
	Type     ProtectionType
}

func (ppg *ProtectionPacketGenerator) createProtectionData(variable adj_module.Measurement, severity ProtectionSeverity) *ProtectionData {
	protectionType := ppg.getProtectionType(variable.Type)
	
	// Generate realistic protection scenarios
	var kind ProtectionKind
	var value, bound float64
	
	if len(variable.WarningRange) == 2 && variable.WarningRange[0] != nil && variable.WarningRange[1] != nil {
		// Create out of bounds condition
		kind = OutOfBoundsKind
		lowerBound := *variable.WarningRange[0]
		upperBound := *variable.WarningRange[1]
		
		if rand.Float64() < 0.5 {
			// Below lower bound
			value = lowerBound - (rand.Float64() * 10)
			bound = lowerBound
		} else {
			// Above upper bound
			value = upperBound + (rand.Float64() * 10)
			bound = upperBound
		}
	} else {
		// Create simple above/below condition
		if rand.Float64() < 0.5 {
			kind = AboveKind
			bound = 100.0
			value = bound + (rand.Float64() * 50)
		} else {
			kind = BelowKind
			bound = 0.0
			value = bound - (rand.Float64() * 10)
		}
	}
	
	return &ProtectionData{
		Kind:     kind,
		Severity: severity,
		Value:    value,
		Bound:    bound,
		Type:     protectionType,
	}
}

func (ppg *ProtectionPacketGenerator) getProtectionType(varType string) ProtectionType {
	switch varType {
	case "int8":
		return Int8Type
	case "int16":
		return ShortType
	case "int32":
		return IntType
	case "int64":
		return LongType
	case "uint8":
		return Uint8Type
	case "uint16":
		return Uint16Type
	case "uint32":
		return Uint32Type
	case "uint64":
		return Uint64Type
	case "float32":
		return FloatType
	case "float64":
		return DoubleType
	case "bool":
		return BoolType
	default:
		return FloatType
	}
}

func (ppg *ProtectionPacketGenerator) buildProtectionPacket(data *ProtectionData, name string) []byte {
	buf := bytes.NewBuffer(make([]byte, 0, 128))
	
	// Write packet ID
	binary.Write(buf, binary.LittleEndian, ppg.protectionID)
	
	// Write protection type
	binary.Write(buf, binary.LittleEndian, uint8(data.Type))
	
	// Write protection kind
	binary.Write(buf, binary.LittleEndian, uint8(data.Kind))
	
	// Write name (null-terminated string)
	buf.WriteString(name)
	buf.WriteByte(0)
	
	// Write protection data based on kind
	switch data.Kind {
	case BelowKind, AboveKind:
		ppg.writeProtectionValue(buf, data.Bound, data.Type) // threshold
		ppg.writeProtectionValue(buf, data.Value, data.Type) // current value
	case OutOfBoundsKind:
		ppg.writeProtectionValue(buf, data.Bound-10, data.Type) // lower bound
		ppg.writeProtectionValue(buf, data.Bound+10, data.Type) // upper bound
		ppg.writeProtectionValue(buf, data.Value, data.Type)    // current value
	case EqualsKind, NotEqualsKind:
		ppg.writeProtectionValue(buf, data.Bound, data.Type) // target value
		ppg.writeProtectionValue(buf, data.Value, data.Type) // current value
	}
	
	// Write timestamp
	timestamp := common.NewTimestamp()
	binary.Write(buf, binary.LittleEndian, timestamp.Counter)
	binary.Write(buf, binary.LittleEndian, timestamp.Second)
	binary.Write(buf, binary.LittleEndian, timestamp.Minute)
	binary.Write(buf, binary.LittleEndian, timestamp.Hour)
	binary.Write(buf, binary.LittleEndian, timestamp.Day)
	binary.Write(buf, binary.LittleEndian, timestamp.Month)
	binary.Write(buf, binary.LittleEndian, timestamp.Year)
	
	return buf.Bytes()
}

func (ppg *ProtectionPacketGenerator) writeProtectionValue(buf *bytes.Buffer, value float64, pType ProtectionType) {
	switch pType {
	case Int8Type:
		binary.Write(buf, binary.LittleEndian, int8(value))
	case ShortType:
		binary.Write(buf, binary.LittleEndian, int16(value))
	case IntType:
		binary.Write(buf, binary.LittleEndian, int32(value))
	case LongType:
		binary.Write(buf, binary.LittleEndian, int64(value))
	case Uint8Type:
		binary.Write(buf, binary.LittleEndian, uint8(value))
	case Uint16Type:
		binary.Write(buf, binary.LittleEndian, uint16(value))
	case Uint32Type:
		binary.Write(buf, binary.LittleEndian, uint32(value))
	case Uint64Type:
		binary.Write(buf, binary.LittleEndian, uint64(value))
	case FloatType:
		binary.Write(buf, binary.LittleEndian, float32(value))
	case DoubleType:
		binary.Write(buf, binary.LittleEndian, value)
	case BoolType:
		binary.Write(buf, binary.LittleEndian, value != 0)
	case CharType:
		binary.Write(buf, binary.LittleEndian, uint8(value))
	}
}


func (ppg *ProtectionPacketGenerator) getDataPackets() []adj_module.Packet {
	var dataPackets []adj_module.Packet
	for _, packet := range ppg.board.Packets {
		if packet.Type == "data" {
			dataPackets = append(dataPackets, packet)
		}
	}
	return dataPackets
}

func (ppg *ProtectionPacketGenerator) GenerateCustomPacket(data map[string]interface{}) ([]byte, error) {
	severityStr, ok := data["severity"].(string)
	if !ok {
		return nil, fmt.Errorf("severity is required")
	}
	
	var severity ProtectionSeverity
	switch severityStr {
	case "fault":
		severity = FaultSeverity
	case "warning":
		severity = WarningSeverity
	case "ok":
		severity = OkSeverity
	default:
		return nil, fmt.Errorf("unknown severity: %s", severityStr)
	}
	
	kindStr, ok := data["kind"].(string)
	if !ok {
		return nil, fmt.Errorf("kind is required")
	}
	
	var kind ProtectionKind
	switch kindStr {
	case "below":
		kind = BelowKind
	case "above":
		kind = AboveKind
	case "out_of_bounds":
		kind = OutOfBoundsKind
	case "equals":
		kind = EqualsKind
	case "not_equals":
		kind = NotEqualsKind
	case "error_handler":
		kind = ErrorHandlerKind
	case "time_accumulation":
		kind = TimeAccumulationKind
	case "warning":
		kind = WarningKind
	default:
		return nil, fmt.Errorf("unknown kind: %s", kindStr)
	}
	
	name, ok := data["name"].(string)
	if !ok {
		return nil, fmt.Errorf("name is required")
	}
	
	value, ok := data["value"].(float64)
	if !ok {
		return nil, fmt.Errorf("value is required")
	}
	
	bound, ok := data["bound"].(float64)
	if !ok {
		return nil, fmt.Errorf("bound is required")
	}
	
	protectionData := &ProtectionData{
		Kind:     kind,
		Severity: severity,
		Value:    value,
		Bound:    bound,
		Type:     FloatType,
	}
	
	return ppg.buildProtectionPacket(protectionData, name), nil
}

func (ppg *ProtectionPacketGenerator) GetActiveFaults() map[string]ProtectionState {
	result := make(map[string]ProtectionState)
	for key, state := range ppg.currentFaults {
		result[key] = state
	}
	return result
}

func (ppg *ProtectionPacketGenerator) ClearFault(faultKey string) {
	delete(ppg.currentFaults, faultKey)
	delete(ppg.faultTimer, faultKey)
}