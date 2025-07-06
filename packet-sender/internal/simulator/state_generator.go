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

type StatePacketGenerator struct {
	board          adj_module.Board
	logger         Logger
	statePacketID  uint16
	currentState   string
	stateHistory   []StateTransition
	lastTransition time.Time
	stateMachine   *StateMachine
}

type StateTransition struct {
	From      string
	To        string
	Timestamp time.Time
	Reason    string
}

type StateMachine struct {
	states      []string
	transitions map[string][]string
	current     string
}

func NewStatePacketGenerator(board adj_module.Board, logger Logger) *StatePacketGenerator {
	spg := &StatePacketGenerator{
		board:         board,
		logger:        logger,
		statePacketID: 0x9000, // State packet ID range
		currentState:  "IDLE",
		stateHistory:  make([]StateTransition, 0),
		stateMachine:  createDefaultStateMachine(),
	}
	
	// Initialize state machine
	spg.stateMachine.current = "IDLE"
	spg.currentState = "IDLE"
	
	return spg
}

func createDefaultStateMachine() *StateMachine {
	return &StateMachine{
		states: []string{
			"IDLE",
			"STARTUP",
			"READY",
			"RUNNING",
			"FAULT",
			"SHUTDOWN",
			"EMERGENCY",
		},
		transitions: map[string][]string{
			"IDLE":      {"STARTUP"},
			"STARTUP":   {"READY", "FAULT"},
			"READY":     {"RUNNING", "IDLE", "FAULT"},
			"RUNNING":   {"READY", "FAULT", "EMERGENCY"},
			"FAULT":     {"IDLE", "SHUTDOWN", "EMERGENCY"},
			"SHUTDOWN":  {"IDLE"},
			"EMERGENCY": {"SHUTDOWN"},
		},
		current: "IDLE",
	}
}

func (spg *StatePacketGenerator) GeneratePacket() []byte {
	// Generate state transitions less frequently
	if time.Since(spg.lastTransition) < 10*time.Second {
		return nil
	}
	
	// Randomly decide whether to transition
	if rand.Float64() < 0.3 { // 30% chance of state transition
		return spg.generateStateTransition()
	}
	
	return nil
}

func (spg *StatePacketGenerator) generateStateTransition() []byte {
	possibleStates := spg.stateMachine.transitions[spg.currentState]
	if len(possibleStates) == 0 {
		return nil
	}
	
	// Select next state based on realistic probabilities
	nextState := spg.selectNextState(possibleStates)
	if nextState == "" {
		return nil
	}
	
	// Create transition
	transition := StateTransition{
		From:      spg.currentState,
		To:        nextState,
		Timestamp: time.Now(),
		Reason:    spg.generateTransitionReason(spg.currentState, nextState),
	}
	
	spg.currentState = nextState
	spg.stateMachine.current = nextState
	spg.stateHistory = append(spg.stateHistory, transition)
	spg.lastTransition = time.Now()
	
	// Keep only last 100 transitions
	if len(spg.stateHistory) > 100 {
		spg.stateHistory = spg.stateHistory[1:]
	}
	
	packet := spg.buildStatePacket(transition)
	spg.logger.Info("State transition for %s: %s -> %s (%s)", 
		spg.board.Name, transition.From, transition.To, transition.Reason)
	
	return packet
}

func (spg *StatePacketGenerator) selectNextState(possibleStates []string) string {
	if len(possibleStates) == 0 {
		return ""
	}
	
	// Apply realistic probabilities based on current state
	switch spg.currentState {
	case "IDLE":
		return "STARTUP" // Always go to startup from idle
	case "STARTUP":
		if rand.Float64() < 0.1 { // 10% chance of fault during startup
			return "FAULT"
		}
		return "READY"
	case "READY":
		prob := rand.Float64()
		if prob < 0.6 { // 60% chance to start running
			return "RUNNING"
		} else if prob < 0.9 { // 30% chance to go back to idle
			return "IDLE"
		} else { // 10% chance of fault
			return "FAULT"
		}
	case "RUNNING":
		prob := rand.Float64()
		if prob < 0.7 { // 70% chance to continue running -> ready
			return "READY"
		} else if prob < 0.95 { // 25% chance of fault
			return "FAULT"
		} else { // 5% chance of emergency
			return "EMERGENCY"
		}
	case "FAULT":
		prob := rand.Float64()
		if prob < 0.6 { // 60% chance to recover to idle
			return "IDLE"
		} else if prob < 0.9 { // 30% chance to shutdown
			return "SHUTDOWN"
		} else { // 10% chance of emergency
			return "EMERGENCY"
		}
	case "SHUTDOWN":
		return "IDLE" // Always go to idle from shutdown
	case "EMERGENCY":
		return "SHUTDOWN" // Always go to shutdown from emergency
	default:
		return possibleStates[rand.Intn(len(possibleStates))]
	}
}

func (spg *StatePacketGenerator) generateTransitionReason(from, to string) string {
	switch {
	case from == "IDLE" && to == "STARTUP":
		return "System initialization requested"
	case from == "STARTUP" && to == "READY":
		return "Startup sequence completed successfully"
	case from == "STARTUP" && to == "FAULT":
		return "Startup sequence failed"
	case from == "READY" && to == "RUNNING":
		return "Operation mode activated"
	case from == "READY" && to == "IDLE":
		return "System standby requested"
	case from == "RUNNING" && to == "READY":
		return "Operation completed"
	case to == "FAULT":
		return "System fault detected"
	case to == "EMERGENCY":
		return "Emergency stop activated"
	case to == "SHUTDOWN":
		return "System shutdown initiated"
	case to == "IDLE":
		return "System reset to idle"
	default:
		return "State transition"
	}
}

func (spg *StatePacketGenerator) buildStatePacket(transition StateTransition) []byte {
	buf := bytes.NewBuffer(make([]byte, 0, 64))
	
	// Write packet ID
	binary.Write(buf, binary.LittleEndian, spg.statePacketID)
	
	// Write state transition data
	// State ID (enum-like)
	stateID := spg.getStateID(transition.To)
	binary.Write(buf, binary.LittleEndian, uint8(stateID))
	
	// Previous state ID
	prevStateID := spg.getStateID(transition.From)
	binary.Write(buf, binary.LittleEndian, uint8(prevStateID))
	
	// Timestamp
	timestamp := common.NewTimestamp()
	binary.Write(buf, binary.LittleEndian, timestamp.Counter)
	binary.Write(buf, binary.LittleEndian, timestamp.Second)
	binary.Write(buf, binary.LittleEndian, timestamp.Minute)
	binary.Write(buf, binary.LittleEndian, timestamp.Hour)
	binary.Write(buf, binary.LittleEndian, timestamp.Day)
	binary.Write(buf, binary.LittleEndian, timestamp.Month)
	binary.Write(buf, binary.LittleEndian, timestamp.Year)
	
	// Reason (as a byte indicating reason type)
	reasonCode := spg.getReasonCode(transition.Reason)
	binary.Write(buf, binary.LittleEndian, uint8(reasonCode))
	
	return buf.Bytes()
}

func (spg *StatePacketGenerator) getStateID(state string) int {
	for i, s := range spg.stateMachine.states {
		if s == state {
			return i
		}
	}
	return 0
}

func (spg *StatePacketGenerator) getReasonCode(reason string) int {
	// Simple mapping of reasons to codes
	reasonCodes := map[string]int{
		"System initialization requested":      1,
		"Startup sequence completed successfully": 2,
		"Startup sequence failed":              3,
		"Operation mode activated":             4,
		"System standby requested":             5,
		"Operation completed":                  6,
		"System fault detected":                7,
		"Emergency stop activated":             8,
		"System shutdown initiated":            9,
		"System reset to idle":                 10,
	}
	
	if code, exists := reasonCodes[reason]; exists {
		return code
	}
	return 0
}


func (spg *StatePacketGenerator) GenerateCustomPacket(data map[string]interface{}) ([]byte, error) {
	toState, ok := data["to_state"].(string)
	if !ok {
		return nil, fmt.Errorf("to_state is required")
	}
	
	// Validate state
	validState := false
	for _, state := range spg.stateMachine.states {
		if state == toState {
			validState = true
			break
		}
	}
	if !validState {
		return nil, fmt.Errorf("invalid state: %s", toState)
	}
	
	// Check if transition is valid
	possibleStates := spg.stateMachine.transitions[spg.currentState]
	validTransition := false
	for _, state := range possibleStates {
		if state == toState {
			validTransition = true
			break
		}
	}
	if !validTransition {
		return nil, fmt.Errorf("invalid transition from %s to %s", spg.currentState, toState)
	}
	
	reason, ok := data["reason"].(string)
	if !ok {
		reason = "Manual state transition"
	}
	
	// Create transition
	transition := StateTransition{
		From:      spg.currentState,
		To:        toState,
		Timestamp: time.Now(),
		Reason:    reason,
	}
	
	spg.currentState = toState
	spg.stateMachine.current = toState
	spg.stateHistory = append(spg.stateHistory, transition)
	spg.lastTransition = time.Now()
	
	return spg.buildStatePacket(transition), nil
}

func (spg *StatePacketGenerator) GetCurrentState() string {
	return spg.currentState
}

func (spg *StatePacketGenerator) GetStateHistory() []StateTransition {
	return spg.stateHistory
}

func (spg *StatePacketGenerator) GetPossibleStates() []string {
	return spg.stateMachine.transitions[spg.currentState]
}

func (spg *StatePacketGenerator) ForceState(state string) error {
	// Validate state
	validState := false
	for _, s := range spg.stateMachine.states {
		if s == state {
			validState = true
			break
		}
	}
	if !validState {
		return fmt.Errorf("invalid state: %s", state)
	}
	
	// Force transition
	transition := StateTransition{
		From:      spg.currentState,
		To:        state,
		Timestamp: time.Now(),
		Reason:    "Forced state transition",
	}
	
	spg.currentState = state
	spg.stateMachine.current = state
	spg.stateHistory = append(spg.stateHistory, transition)
	spg.lastTransition = time.Now()
	
	return nil
}