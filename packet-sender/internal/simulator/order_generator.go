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

type OrderPacketGenerator struct {
	board         adj_module.Board
	logger        Logger
	orderPackets  []adj_module.Packet
	pendingOrders map[uint16]PendingOrder
	lastAck       time.Time
}

type PendingOrder struct {
	PacketID  uint16
	OrderID   uint32
	Timestamp time.Time
	Status    OrderStatus
	Data      []byte
}

type OrderStatus uint8

const (
	OrderReceived OrderStatus = iota
	OrderExecuting
	OrderCompleted
	OrderFailed
	OrderTimeout
)

func NewOrderPacketGenerator(board adj_module.Board, logger Logger) *OrderPacketGenerator {
	opg := &OrderPacketGenerator{
		board:         board,
		logger:        logger,
		orderPackets:  make([]adj_module.Packet, 0),
		pendingOrders: make(map[uint16]PendingOrder),
	}
	
	// Filter order packets
	for _, packet := range board.Packets {
		if packet.Type == "order" {
			opg.orderPackets = append(opg.orderPackets, packet)
		}
	}
	
	return opg
}

func (opg *OrderPacketGenerator) GeneratePacket() []byte {
	// Generate order acknowledgments less frequently
	if time.Since(opg.lastAck) < 2*time.Second {
		return nil
	}
	
	// Process pending orders
	opg.processPendingOrders()
	
	// Randomly generate order acknowledgments
	if rand.Float64() < 0.2 { // 20% chance
		return opg.generateOrderAck()
	}
	
	return nil
}

func (opg *OrderPacketGenerator) generateOrderAck() []byte {
	if len(opg.orderPackets) == 0 {
		return nil
	}
	
	// Select random order packet
	packet := opg.orderPackets[rand.Intn(len(opg.orderPackets))]
	
	// Generate random order ID
	orderID := rand.Uint32()
	
	// Create acknowledgment
	ack := PendingOrder{
		PacketID:  packet.Id,
		OrderID:   orderID,
		Timestamp: time.Now(),
		Status:    OrderReceived,
		Data:      opg.generateOrderData(packet),
	}
	
	// Add to pending orders
	opg.pendingOrders[packet.Id] = ack
	
	packetData := opg.buildOrderPacket(ack)
	opg.lastAck = time.Now()
	
	opg.logger.Info("Generated order acknowledgment for packet %d (order %d)", packet.Id, orderID)
	return packetData
}

func (opg *OrderPacketGenerator) generateOrderData(packet adj_module.Packet) []byte {
	buf := bytes.NewBuffer(make([]byte, 0, 64))
	
	// Generate mock order data based on packet variables
	for _, variable := range packet.Variables {
		switch variable.Type {
		case "uint8":
			binary.Write(buf, binary.LittleEndian, uint8(rand.Intn(256)))
		case "uint16":
			binary.Write(buf, binary.LittleEndian, uint16(rand.Intn(65536)))
		case "uint32":
			binary.Write(buf, binary.LittleEndian, rand.Uint32())
		case "int8":
			binary.Write(buf, binary.LittleEndian, int8(rand.Intn(256)-128))
		case "int16":
			binary.Write(buf, binary.LittleEndian, int16(rand.Intn(65536)-32768))
		case "int32":
			binary.Write(buf, binary.LittleEndian, rand.Int31())
		case "float32":
			binary.Write(buf, binary.LittleEndian, rand.Float32())
		case "float64":
			binary.Write(buf, binary.LittleEndian, rand.Float64())
		case "bool":
			binary.Write(buf, binary.LittleEndian, rand.Float64() < 0.5)
		}
	}
	
	return buf.Bytes()
}

func (opg *OrderPacketGenerator) buildOrderPacket(order PendingOrder) []byte {
	buf := bytes.NewBuffer(make([]byte, 0, 128))
	
	// Write packet ID
	binary.Write(buf, binary.LittleEndian, order.PacketID)
	
	// Write order ID
	binary.Write(buf, binary.LittleEndian, order.OrderID)
	
	// Write status
	binary.Write(buf, binary.LittleEndian, uint8(order.Status))
	
	// Write timestamp
	timestamp := common.NewTimestamp()
	binary.Write(buf, binary.LittleEndian, timestamp.Counter)
	binary.Write(buf, binary.LittleEndian, timestamp.Second)
	binary.Write(buf, binary.LittleEndian, timestamp.Minute)
	binary.Write(buf, binary.LittleEndian, timestamp.Hour)
	binary.Write(buf, binary.LittleEndian, timestamp.Day)
	binary.Write(buf, binary.LittleEndian, timestamp.Month)
	binary.Write(buf, binary.LittleEndian, timestamp.Year)
	
	// Write order data
	buf.Write(order.Data)
	
	return buf.Bytes()
}

func (opg *OrderPacketGenerator) processPendingOrders() {
	for packetID, order := range opg.pendingOrders {
		// Simulate order processing
		elapsed := time.Since(order.Timestamp)
		
		switch order.Status {
		case OrderReceived:
			if elapsed > 1*time.Second {
				// Move to executing
				order.Status = OrderExecuting
				opg.pendingOrders[packetID] = order
				opg.logger.Debug("Order %d moved to executing", order.OrderID)
			}
		case OrderExecuting:
			if elapsed > 5*time.Second {
				// Randomly complete or fail
				if rand.Float64() < 0.9 { // 90% success rate
					order.Status = OrderCompleted
					opg.logger.Info("Order %d completed successfully", order.OrderID)
				} else {
					order.Status = OrderFailed
					opg.logger.Warn("Order %d failed", order.OrderID)
				}
				opg.pendingOrders[packetID] = order
			}
		case OrderCompleted, OrderFailed:
			if elapsed > 10*time.Second {
				// Remove completed/failed orders
				delete(opg.pendingOrders, packetID)
				opg.logger.Debug("Order %d removed from pending", order.OrderID)
			}
		default:
			// Handle timeout
			if elapsed > 30*time.Second {
				order.Status = OrderTimeout
				opg.pendingOrders[packetID] = order
				opg.logger.Warn("Order %d timed out", order.OrderID)
			}
		}
	}
}


func (opg *OrderPacketGenerator) GenerateCustomPacket(data map[string]interface{}) ([]byte, error) {
	packetIDFloat, ok := data["packet_id"].(float64)
	if !ok {
		return nil, fmt.Errorf("packet_id is required")
	}
	packetID := uint16(packetIDFloat)
	
	// Find the order packet
	var targetPacket *adj_module.Packet
	for _, packet := range opg.orderPackets {
		if packet.Id == packetID {
			targetPacket = &packet
			break
		}
	}
	
	if targetPacket == nil {
		return nil, fmt.Errorf("order packet ID %d not found", packetID)
	}
	
	orderIDFloat, ok := data["order_id"].(float64)
	if !ok {
		return nil, fmt.Errorf("order_id is required")
	}
	orderID := uint32(orderIDFloat)
	
	statusStr, ok := data["status"].(string)
	if !ok {
		return nil, fmt.Errorf("status is required")
	}
	
	var status OrderStatus
	switch statusStr {
	case "received":
		status = OrderReceived
	case "executing":
		status = OrderExecuting
	case "completed":
		status = OrderCompleted
	case "failed":
		status = OrderFailed
	case "timeout":
		status = OrderTimeout
	default:
		return nil, fmt.Errorf("unknown status: %s", statusStr)
	}
	
	// Create order
	order := PendingOrder{
		PacketID:  packetID,
		OrderID:   orderID,
		Timestamp: time.Now(),
		Status:    status,
		Data:      opg.generateOrderData(*targetPacket),
	}
	
	// Add to pending orders if not final status
	if status != OrderCompleted && status != OrderFailed {
		opg.pendingOrders[packetID] = order
	}
	
	return opg.buildOrderPacket(order), nil
}

func (opg *OrderPacketGenerator) GetPendingOrders() map[uint16]PendingOrder {
	result := make(map[uint16]PendingOrder)
	for id, order := range opg.pendingOrders {
		result[id] = order
	}
	return result
}

func (opg *OrderPacketGenerator) GetOrderPackets() []adj_module.Packet {
	return opg.orderPackets
}

func (opg *OrderPacketGenerator) CompleteOrder(packetID uint16, orderID uint32) error {
	order, exists := opg.pendingOrders[packetID]
	if !exists {
		return fmt.Errorf("order not found for packet %d", packetID)
	}
	
	if order.OrderID != orderID {
		return fmt.Errorf("order ID mismatch: expected %d, got %d", order.OrderID, orderID)
	}
	
	order.Status = OrderCompleted
	opg.pendingOrders[packetID] = order
	
	opg.logger.Info("Order %d marked as completed", orderID)
	return nil
}

func (opg *OrderPacketGenerator) FailOrder(packetID uint16, orderID uint32) error {
	order, exists := opg.pendingOrders[packetID]
	if !exists {
		return fmt.Errorf("order not found for packet %d", packetID)
	}
	
	if order.OrderID != orderID {
		return fmt.Errorf("order ID mismatch: expected %d, got %d", order.OrderID, orderID)
	}
	
	order.Status = OrderFailed
	opg.pendingOrders[packetID] = order
	
	opg.logger.Warn("Order %d marked as failed", orderID)
	return nil
}