package vehicle

import (
	"bytes"
	"encoding/binary"
	"fmt"
	"net"
	"strings"

	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/HyperloopUPV-H8/h9-backend/internal/packet"
	"github.com/HyperloopUPV-H8/h9-backend/internal/pipe"
	"github.com/HyperloopUPV-H8/h9-backend/internal/sniffer"
	"github.com/HyperloopUPV-H8/h9-backend/internal/unit_converter"
	"github.com/HyperloopUPV-H8/h9-backend/internal/vehicle/message_parser"
	"github.com/HyperloopUPV-H8/h9-backend/internal/vehicle/models"
	"github.com/HyperloopUPV-H8/h9-backend/internal/vehicle/packet_parser"
	"github.com/rs/zerolog"
)

type Vehicle struct {
	sniffer     sniffer.Sniffer
	pipes       map[string]*pipe.Pipe
	backendAddr net.IP

	displayConverter unit_converter.UnitConverter
	podConverter     unit_converter.UnitConverter

	dataIds             common.Set[uint16]
	orderIds            common.Set[uint16]
	messageIds          common.Set[uint16]
	blcuAckId           uint16
	addStateOrdersId    uint16
	removeStateOrdersId uint16
	stateSpaceId        uint16

	packetParser   packet_parser.PacketParser
	messageParser  message_parser.MessageParser
	bitarrayParser BitarrayParser

	dataChan chan packet.Packet

	idToBoard map[uint16]string

	onConnectionChange func(string, bool)

	trace zerolog.Logger
}

// func (vehicle *Vehicle) propagateFault(source string, payload []byte) {
// 	for _, pipe := range vehicle.pipes {
// 		pipe.SendFault(source, payload)
// 	}
// }

func (vehicle *Vehicle) Listen(updateChan chan<- models.PacketUpdate, transmittedOrderChan chan<- models.PacketUpdate, messageChan chan<- any, blcuAckChan chan<- struct{}, stateOrdersChan chan<- message_parser.StateOrdersAdapter, stateSpaceChan chan<- models.StateSpace) {
	vehicle.trace.Debug().Msg("vehicle listening")
	for packet := range vehicle.dataChan {
		payloadCopy := make([]byte, len(packet.Payload))
		copy(payloadCopy, packet.Payload)

		if packet.Metadata.ID == 0 {
			continue
		}

		//TODO: add order decoding
		switch id := packet.Metadata.ID; {
		case vehicle.dataIds.Has(id):
			update, err := vehicle.getUpdate(packet)

			if err != nil {
				vehicle.trace.Error().Err(err).Msg("error decoding packet")
				continue
			}

			updateChan <- update

		case vehicle.orderIds.Has(id):
			update, err := vehicle.getUpdate(packet)

			if err != nil {
				vehicle.trace.Error().Err(err).Msg("error decoding packet")
				continue
			}

			transmittedOrderChan <- update

		case id == vehicle.stateSpaceId:
			stateSpace := models.NewStateSpace(packet.Payload)
			stateSpaceChan <- stateSpace

		case vehicle.messageIds.Has(id):

			if !strings.Contains(packet.Metadata.To, vehicle.backendAddr.String()) {
				continue
			}

			if id == vehicle.blcuAckId {
				blcuAckChan <- struct{}{}
				continue
			}

			message, err := vehicle.messageParser.Parse(id, packet.Payload)

			if err != nil {
				vehicle.trace.Error().Err(err).Msg("error decoding protection")
				continue
			}

			if id == vehicle.addStateOrdersId || id == vehicle.removeStateOrdersId {
				stateOrders, ok := message.(message_parser.StateOrdersAdapter)
				if !ok {
					vehicle.trace.Error().Type("type", message).Uint16("id", id).Msg("invalid type for state orders")
					continue
				}
				stateOrdersChan <- stateOrders
				continue
			}

			messageChan <- message

		default:
			vehicle.trace.Error().Uint16("id", packet.Metadata.ID).Msg("raw id not recognized")
		}
	}
}

func (vehicle *Vehicle) SendOrder(order models.Order) error {
	vehicle.trace.Info().Uint16("id", order.ID).Msg("send order")

	board, ok := vehicle.idToBoard[order.ID]

	if !ok {
		return fmt.Errorf("board for order id %d not found", order.ID)
	}

	switch board {
	case "BLCU":
		return vehicle.sendOrderToBoard(order, "BLCU")
	case "TCU":
		return vehicle.sendOrderToBoard(order, "TCU")
	default:
		return vehicle.sendOrderToBoard(order, "VCU")
	}
}

func (vehicle *Vehicle) sendOrderToBoard(order models.Order, board string) error {
	pipe, ok := vehicle.pipes[board]

	if !ok {
		vehicle.trace.Error().Str("board", board).Msg("pipe not found")
		return nil
	}

	buf, err := vehicle.orderToBuf(order)

	if err != nil {
		vehicle.trace.Error().Err(err).Msg("converting order to buf")
		return err
	}

	_, err = common.WriteAll(pipe, buf)

	return err
}

func (vehicle *Vehicle) orderToBuf(order models.Order) ([]byte, error) {
	values := getOrderValues(order, vehicle.trace)
	convertedValues := vehicle.applyUnitConversion(values)

	buf := new(bytes.Buffer)

	idBuf := make([]byte, 2)
	binary.LittleEndian.PutUint16(idBuf, order.ID)

	err := vehicle.packetParser.Encode(order.ID, convertedValues, buf)
	if err != nil {
		vehicle.trace.Error().Err(err).Msg("error encoding order")
		return nil, err
	}

	enableBuf := new(bytes.Buffer)
	vehicle.bitarrayParser.encodeBitarray(getOrderEnables(order), enableBuf)

	bufWithoutBitarray := append(idBuf, buf.Bytes()...)
	return bufWithoutBitarray, nil
}

func (vehicle *Vehicle) getUpdate(packet packet.Packet) (models.PacketUpdate, error) {
	update, err := vehicle.packetParser.Decode(packet.Metadata.ID, packet.Payload, packet.Metadata)

	if err != nil {
		return models.PacketUpdate{}, nil
	}

	convertedValues := vehicle.applyUnitConversion(update.Values)
	update.Values = convertedValues

	return update, nil
}

func (vehicle *Vehicle) applyUnitConversion(values map[string]packet.Value) map[string]packet.Value {
	newValues := make(map[string]packet.Value)

	for name, value := range values {
		switch typedValue := value.(type) {
		case packet.Numeric:
			newValues[name] = vehicle.applyNumericConversion(name, float64(typedValue))
		default:
			newValues[name] = typedValue
		}
	}

	return newValues
}

func (vehicle *Vehicle) applyNumericConversion(name string, value float64) packet.Numeric {
	valueInSIUnits, podErr := vehicle.podConverter.Revert(name, value)

	if podErr != nil {
		vehicle.trace.Error().Err(podErr).Msg("error reverting podUnits")
	}

	valueInDisplayUnits, displayErr := vehicle.displayConverter.Convert(name, valueInSIUnits)

	if displayErr != nil {
		vehicle.trace.Error().Err(displayErr).Msg("error converting to displayUnits")

	}

	return packet.Numeric(valueInDisplayUnits)
}

func (vehicle *Vehicle) getPipe(id uint16) (*pipe.Pipe, error) {
	board, ok := vehicle.idToBoard[id]
	if !ok {
		return nil, fmt.Errorf("board for id %d not found", id)
	}

	pipe, ok := vehicle.pipes[board]
	if !ok {
		return nil, fmt.Errorf("pipe for board %s not found", board)
	}

	return pipe, nil
}

func getOrderValues(order models.Order, trace zerolog.Logger) map[string]packet.Value {
	values := make(map[string]packet.Value)

	for name, field := range order.Fields {
		switch value := field.Value.(type) {
		case float64:
			values[name] = packet.Numeric(value)
		case uint16:
			values[name] = packet.Numeric(value)
		case bool:
			values[name] = packet.Boolean(value)
		case string:
			values[name] = packet.Enum(value)
		default:
			trace.Error().Str("name", name).Type("type", field.Value).Msg("order field value not recognized")
		}
	}

	return values
}

func getOrderEnables(order models.Order) map[string]bool {
	enables := make(map[string]bool, 0)

	for name, field := range order.Fields {
		enables[name] = field.IsEnabled
	}

	return enables
}
