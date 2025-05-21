package main

import (
	"bytes"
	"encoding/binary"
	"log"
	"math"
	"math/rand"
	"strconv"
	"strings"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/adj"
)

type PacketGenerator struct {
	packets []Packet
}

func New() PacketGenerator {
	adj, err := adj.NewADJ("HVSCU-Cabinet", false)
	if err != nil {
		log.Fatalf("Failed to load ADJ: %v\n", err)
	}

	packets := make([]Packet, 0)

	for _, board := range adj.Boards {
		for _, packet := range board.Packets {
			if packet.Type != "data" {
				continue
			}

			id, err := strconv.ParseUint(strconv.Itoa(int(packet.Id)), 10, 16)
			if err != nil {
				log.Fatalf("data transfer: AddPacket: %s\n", err)
			}

			packets = append(packets, Packet{
				ID:           uint16(id),
				Name:         packet.Name,
				HexValue:     "",
				Count:        0,
				CycleTime:    0,
				Measurements: getMeasurements(packet.Variables),
			})
		}
	}

	pg := PacketGenerator{
		packets: packets,
	}

	return pg
}

func (pg *PacketGenerator) CreateRandomPacket() []byte {
	if len(pg.packets) == 0 {

		return nil
	}

	randomIndex := rand.Int63n(int64(len(pg.packets)))
	randomPacket := pg.packets[randomIndex]

	if len(randomPacket.Measurements) == 0 {

		log.Printf("The packet with ID %d has no measurements\n", randomPacket.ID)
		return nil
	}

	buff := bytes.NewBuffer(make([]byte, 0))
	binary.Write(buff, binary.LittleEndian, randomPacket.ID)

	for _, measurement := range randomPacket.Measurements {
		if strings.Contains(measurement.Type, "enum") {

			list := strings.Split(strings.ReplaceAll(strings.TrimSuffix(strings.TrimPrefix(measurement.Type, "enum("), ")"), " ", ""), ",")
			if len(list) == 0 {

				log.Printf("Empty list for enum: %v\n", measurement.Type)
				continue
			}

			randomIndex := rand.Int63n(int64(len(list)))
			if randomIndex >= 0 && randomIndex < int64(len(list)) {
				binary.Write(buff, binary.LittleEndian, uint8(randomIndex))
			} else {

				log.Printf("Index out of range for enum: %v, index: %d, length: %d\n", measurement.Type, randomIndex, len(list))
				continue
			}
		} else if measurement.Type == "bool" {

			binary.Write(buff, binary.LittleEndian, rand.Int31n(2) == 1)
		} else if measurement.Type != "string" {

			var number float64
			if len(measurement.WarningRange) < 2 {

				continue
			}

			number = mapNumberToRange(
				rand.Float64(),
				[]float64{
					measurement.WarningRange[0] * 0.8,
					measurement.WarningRange[1] * 1.2,
				},
				measurement.Type,
			)
			writeNumberAsBytes(number, measurement.Type, buff)
		} else {

			continue
		}
	}

	return buff.Bytes()
}

func (pg *PacketGenerator) CreateSinePacket() []byte {
	randomIndex := rand.Int63n(int64(len(pg.packets)))
	randomPacket := pg.packets[randomIndex]

	buff := bytes.NewBuffer(make([]byte, 0))

	binary.Write(buff, binary.LittleEndian, randomPacket.ID)

	for _, measurement := range randomPacket.Measurements {
		if strings.Contains(measurement.Type, "enum") {
			binary.Write(buff, binary.LittleEndian, uint8(1))
		} else if measurement.Type != "string" {
			sineValue := generateSinusoidalValue()
			number := mapNumberToRange(sineValue, measurement.SafeRange, measurement.Type)
			writeNumberAsBytes(number, measurement.Type, buff)
		} else {
			return nil
		}
	}

	return buff.Bytes()
}

func generateSinusoidalValue() float64 {
	amplitude := 1.0
	frequency := 0.01
	phase := 0.0

	value := amplitude * math.Sin(2*math.Pi*frequency*float64(time.Now().Unix())+phase)
	return value
}

func mapNumberToRange(number float64, numberRange []float64, numberType string) float64 {
	if len(numberRange) == 0 {
		return number * getTypeMaxValue(numberType)
	} else {
		return (number * (numberRange[1] - numberRange[0])) + numberRange[0]
	}
}

func getTypeMaxValue(numberType string) float64 {
	switch numberType {
	case "uint8":
		return math.MaxUint8
	case "uint16":
		return math.MaxUint16
	case "uint32":
		return math.MaxUint32
	case "uint64":
		return math.MaxUint64
	case "int8":
		return math.MaxInt8
	case "int16":
		return math.MaxInt16
	case "int32":
		return math.MaxInt32
	case "int64":
		return math.MaxInt64
	case "float32":
		return math.MaxFloat32
	case "float64":
		return math.MaxFloat64
	case "bool":
		return math.MaxUint8
	default:
		return math.MaxUint8
	}
}

func writeNumberAsBytes(number float64, numberType string, buff *bytes.Buffer) {
	switch numberType {
	case "uint8":
		binary.Write(buff, binary.LittleEndian, uint8(number))
	case "uint16":
		binary.Write(buff, binary.LittleEndian, uint16(number))

	case "uint32":
		binary.Write(buff, binary.LittleEndian, uint32(number))

	case "uint64":
		binary.Write(buff, binary.LittleEndian, uint64(number))

	case "int8":
		binary.Write(buff, binary.LittleEndian, int8(number))

	case "int16":
		binary.Write(buff, binary.LittleEndian, int16(number))

	case "int32":
		binary.Write(buff, binary.LittleEndian, int32(number))

	case "int64":
		binary.Write(buff, binary.LittleEndian, int64(number))

	case "float32":
		binary.Write(buff, binary.LittleEndian, float32(number))

	case "float64":
		binary.Write(buff, binary.LittleEndian, number)

	case "bool":
		binary.Write(buff, binary.LittleEndian, uint8(number))

	default:
		binary.Write(buff, binary.LittleEndian, uint8(number))
	}
}

func (pg *PacketGenerator) AddPacket(boardName string, packet adj.Packet) {
	if packet.Type != "data" {
		return
	}

	id, err := strconv.ParseUint(strconv.Itoa(int(packet.Id)), 10, 16)
	if err != nil {
		log.Fatalf("data transfer: AddPacket: %s\n", err)
	}

	pg.packets = append(pg.packets, Packet{
		ID:           uint16(id),
		Name:         packet.Name,
		HexValue:     "",
		Count:        0,
		CycleTime:    0,
		Measurements: getMeasurements(packet.Variables),
	})

}

func getMeasurements(variables []adj.Measurement) []Measurement {
	measurements := make([]Measurement, 0, len(variables))
	for _, value := range variables {
		measurements = append(measurements,
			Measurement{
				ID:   value.Id,
				Name: value.Name,
				Type: value.Type,
				//TODO: make sure added property (Value) doesn't break stuff
				Value:        getDefaultValue(value.Type),
				Units:        value.DisplayUnits,
				SafeRange:    parseRange(value.SafeRange),
				WarningRange: parseRange(value.WarningRange),
			},
		)
	}
	return measurements
}

func parseRange(literal []*float64) []float64 {
	if len(literal) == 0 {
		return make([]float64, 0)
	}

	numRange := make([]float64, 0)

	for _, val := range literal {
		if val != nil {
			numRange = append(numRange, *val)
		}
	}

	return numRange
}

func getDefaultValue(valueType string) any {
	switch valueType {
	case "uint8", "uint16", "uint32", "uint64", "int8", "int16", "int32", "int64", "float32", "float64":
		return 0
	case "bool":
		return false
	default:
		return "Default"
	}
}

type Packet struct {
	ID           uint16        `json:"id"`
	Name         string        `json:"name"`
	HexValue     string        `json:"hexValue"`
	Count        uint16        `json:"count"`
	CycleTime    int64         `json:"cycleTime"`
	Measurements []Measurement `json:"measurements"`
}

type Measurement struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Type         string    `json:"type"`
	Value        any       `json:"value"`
	Units        string    `json:"units"`
	SafeRange    []float64 `json:"safeRange"`
	WarningRange []float64 `json:"warningRange"`
}
