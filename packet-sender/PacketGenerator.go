package main

import (
	"bytes"
	"encoding/binary"
	"io"
	"log"
	"math"
	"math/rand"
	"os"
	"path"
	"path/filepath"
	"strings"
	"time"

	adj_module "github.com/HyperloopUPV-H8/h9-backend/pkg/adj"
)

type PacketGenerator struct {
	packets []adj_module.Packet
}

func New() PacketGenerator {

	err := CopyDir(path.Join("..", "backend", "cmd", "adj"), "adj")
	if err != nil {
		log.Fatal(err)
	}

	adj, err := adj_module.NewADJ("", false)
	if err != nil {
		log.Fatalf("Failed to load ADJ: %v\n", err)
	}

	boards := adj.Boards

	packets := make([]adj_module.Packet, 0)

	for _, board := range boards {
		for _, packet := range board.Packets {
			if packet.Type != "data" {
				continue
			}

			packets = append(packets, adj_module.Packet{
				Id:           packet.Id,
				Name:         packet.Name,
				Type:         packet.Type,
				Variables:    packet.Variables,
				VariablesIds: packet.VariablesIds,
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

	if len(randomPacket.VariablesIds) == 0 {
		log.Printf("The packet with ID %d has no measurements\n", randomPacket.Id)
		return nil
	}

	buff := bytes.NewBuffer(make([]byte, 0))

	binary.Write(buff, binary.LittleEndian, randomPacket.Id)

	for _, measurement := range randomPacket.Variables {
		if strings.Contains(measurement.Type, "enum") {
			binary.Write(buff, binary.LittleEndian, uint8(rand.Int63n(int64(len(strings.Split(strings.ReplaceAll(strings.TrimSuffix(strings.TrimPrefix(measurement.Type, "enum("), ")"), " ", ""), ","))))))
		} else if measurement.Type == "bool" {
			binary.Write(buff, binary.LittleEndian, rand.Int31n(2) == 1)
		} else if measurement.Type != "string" {
			var number float64
			if len(measurement.WarningRange) == 0 {
				number = mapNumberToRange(rand.Float64(), measurement.WarningRange, measurement.Type)
			} else if measurement.WarningRange[0] != nil && measurement.WarningRange[1] != nil {
				low := *measurement.WarningRange[0] * 0.8
				high := *measurement.WarningRange[1] * 1.2
				number = mapNumberToRange(rand.Float64(), []*float64{&low, &high}, measurement.Type)
			} else {
				// Fallback if any bound is nil
				number = mapNumberToRange(rand.Float64(), []*float64{}, measurement.Type)
			}
			writeNumberAsBytes(number, measurement.Type, buff)
		} else {
			return nil
		}

	}

	return buff.Bytes()
}

func (pg *PacketGenerator) CreateSinePacket() []byte {
	randomIndex := rand.Int63n(int64(len(pg.packets)))
	randomPacket := pg.packets[randomIndex]

	buff := bytes.NewBuffer(make([]byte, 0))

	binary.Write(buff, binary.LittleEndian, randomPacket.Id)

	for _, measurement := range randomPacket.Variables {
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

func mapNumberToRange(number float64, numberRange []*float64, numberType string) float64 {
	if len(numberRange) == 0 {
		return number * getTypeMaxValue(numberType)
	} else {
		return (number * (*numberRange[1] - *numberRange[0])) + *numberRange[0]
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

// Copies a directory recursively from src to dst
func CopyDir(src string, dst string) error {
	return filepath.Walk(src, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		relPath, err := filepath.Rel(src, path)
		if err != nil {
			return err
		}
		targetPath := filepath.Join(dst, relPath)
		if info.IsDir() {
			return os.MkdirAll(targetPath, info.Mode())
		}
		// Copy file
		return copyFile(path, targetPath, info.Mode())
	})
}

func copyFile(src, dst string, perm os.FileMode) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()
	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer out.Close()
	_, err = io.Copy(out, in)
	if err != nil {
		return err
	}
	return out.Chmod(perm)
}
