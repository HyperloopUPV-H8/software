package pod_data

import (
	"strconv"

	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/HyperloopUPV-H8/h9-backend/internal/excel/ade"
	"github.com/HyperloopUPV-H8/h9-backend/internal/excel/utils"
)

func NewPodData(adeBoards map[string]ade.Board, globalUnits map[string]utils.Operations) (PodData, error) {
	boards := make([]Board, 0)
	boardErrs := common.NewErrorList()

	for _, adeBoard := range adeBoards {
		board, err := getBoard(adeBoard, globalUnits)

		if err != nil {
			boardErrs.Add(err)
		}

		boards = append(boards, board)
	}

	if len(boardErrs) > 0 {
		return PodData{}, boardErrs
	}

	return PodData{
		Boards: boards,
	}, nil

}

func getBoard(adeBoard ade.Board, globalUnits map[string]utils.Operations) (Board, error) {
	boardErrs := common.NewErrorList()
	packets, err := getPackets(adeBoard.Packets)

	if err != nil {
		boardErrs.Add(err)
	}

	measurements, err := getMeasurements(adeBoard.Measurements, globalUnits)

	if err != nil {
		boardErrs.Add(err)
	}

	if len(boardErrs) > 0 {
		return Board{}, boardErrs
	}

	assembledPackets := assemblePackets(packets, measurements, adeBoard.Structures)

	return Board{
		Name:    adeBoard.Name,
		Packets: sortPackets(assembledPackets),
	}, nil
}

func getPackets(adePackets []ade.Packet) ([]Packet, error) {
	packets := make([]Packet, 0)
	packetErrors := common.NewErrorList()

	for _, packet := range adePackets {
		packet, err := getPacket(packet)

		if err != nil {
			//TODO: use stack error
			packetErrors.Add(err)
			continue
		}

		packets = append(packets, packet)
	}

	if len(packetErrors) > 0 {
		return nil, packetErrors
	}

	return packets, nil
}

func getPacket(packet ade.Packet) (Packet, error) {
	id, err := strconv.ParseUint(packet.Id, 10, 16)
	if err != nil {
		return Packet{}, err
	}

	return Packet{
		Id:           uint16(id),
		Name:         packet.Name,
		Type:         packet.Type,
		HexValue:     "000000",
		Count:        0,
		CycleTime:    0,
		Measurements: make([]Measurement, 0),
	}, nil
}

func assemblePackets(packets []Packet, measurements []Measurement, structures []ade.Structure) []Packet {
	assembledPackets := make([]Packet, 0)

	for _, structure := range structures {
		index := common.FindIndex(packets, func(packet Packet) bool {
			return packet.Name == structure.Packet
		})

		if index == -1 {
			//TODO: trace
			continue
		}

		packets[index].Measurements = findMeasurements(measurements, structure.Measurements)

		assembledPackets = append(assembledPackets, packets[index])
	}

	return assembledPackets
}

func findMeasurements(measurements []Measurement, measIds []string) []Measurement {
	foundMeasurements := make([]Measurement, 0)
	for _, measId := range measIds {
		index := common.FindIndex(measurements, func(meas Measurement) bool {
			return meas.GetId() == measId
		})

		if index == -1 {
			//TODO: TRACE
			continue
		}

		foundMeasurements = append(foundMeasurements, measurements[index])
	}

	return foundMeasurements
}

const DataType = "data"

func GetDataOnlyPodData(podData PodData) PodData {
	newBoards := make([]Board, 0)

	for _, board := range podData.Boards {
		newPackets := common.Filter(board.Packets, func(packet Packet) bool {
			return packet.Type == DataType
		})

		newBoards = append(newBoards, Board{
			Name:    board.Name,
			Packets: newPackets,
		})
	}

	return PodData{
		Boards: newBoards,
	}
}
