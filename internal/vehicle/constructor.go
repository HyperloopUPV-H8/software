package vehicle

import (
	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/HyperloopUPV-H8/h9-backend/internal/info"
	"github.com/HyperloopUPV-H8/h9-backend/internal/packet"
	"github.com/HyperloopUPV-H8/h9-backend/internal/pipe"
	"github.com/HyperloopUPV-H8/h9-backend/internal/pod_data"
	"github.com/HyperloopUPV-H8/h9-backend/internal/sniffer"
	"github.com/HyperloopUPV-H8/h9-backend/internal/unit_converter"
	protection_parser "github.com/HyperloopUPV-H8/h9-backend/internal/vehicle/message_parser"
	"github.com/HyperloopUPV-H8/h9-backend/internal/vehicle/packet_parser"
	"github.com/rs/zerolog"
	trace "github.com/rs/zerolog/log"
)

const (
	UPDATE_CHAN_BUF_SIZE = 100
)

type VehicleConstructorArgs struct {
	Boards             []pod_data.Board
	Info               info.Info
	PodData            pod_data.PodData
	Config             Config
	OnConnectionChange func(string, bool)
}

func New(args VehicleConstructorArgs) Vehicle {
	trace.Trace().Msg("creating vehicle")

	vehicleTrace := trace.With().Str("component", "vehicle").Logger()
	dataChan := make(chan packet.Packet, UPDATE_CHAN_BUF_SIZE)

	packetParser, err := packet_parser.CreatePacketParser(args.Info, args.Boards, vehicleTrace)

	if err != nil {
		vehicleTrace.Fatal().Err(err).Msg("error creating packetParser")
	}

	names, err := getPacketToValuesNames(args.Info, args.Boards)

	if err != nil {
		vehicleTrace.Error().Err(err).Msg("error getting packet to values names")
	}

	snifferConfig := getSnifferConfig(args.Config)
	pipesConfig := getPipesConfig(args.Config)

	messageIds := common.NewSet[uint16]()
	messageIds.Add(args.Info.MessageIds.AddStateOrder)
	messageIds.Add(args.Info.MessageIds.RemoveStateOrder)
	messageIds.Add(args.Info.MessageIds.BlcuAck)
	messageIds.Add(args.Info.MessageIds.Fault)
	messageIds.Add(args.Info.MessageIds.Warning)
	messageIds.Add(args.Info.MessageIds.Info)

	vehicle := Vehicle{
		podConverter:     unit_converter.NewUnitConverter("pod", args.Boards, args.Info.Units),
		displayConverter: unit_converter.NewUnitConverter("display", args.Boards, args.Info.Units),
		backendAddr:      args.Info.Addresses.Backend,

		sniffer: sniffer.CreateSniffer(args.Info, snifferConfig, vehicleTrace),
		pipes:   pipe.CreatePipes(args.Info, args.Config.Network.GetKeepAliveInterval(), args.Config.Network.GetWriteTimeout(), args.Config.Boards, dataChan, args.OnConnectionChange, pipesConfig, newPipeReaders(args.Info.MessageIds), vehicleTrace),

		dataIds:             getBoardIdsFromType(args.Boards, "data", vehicleTrace),
		orderIds:            getBoardIdsFromType(args.Boards, "order", vehicleTrace),
		messageIds:          messageIds,
		blcuAckId:           args.Info.MessageIds.BlcuAck,
		addStateOrdersId:    args.Info.MessageIds.AddStateOrder,
		removeStateOrdersId: args.Info.MessageIds.RemoveStateOrder,
		stateSpaceId:        args.Info.MessageIds.StateSpace,

		packetParser:   packetParser,
		messageParser:  protection_parser.NewMessageParser(args.Info, args.PodData),
		bitarrayParser: NewBitarrayParser(names),

		dataChan: dataChan,

		idToBoard:          getIdToBoard(args.Boards, vehicleTrace),
		onConnectionChange: args.OnConnectionChange,
		trace:              vehicleTrace,
	}

	vehicle.sniffer.Listen(dataChan)

	return vehicle
}

func getSnifferConfig(config Config) sniffer.Config {
	return sniffer.Config{
		TcpClientTag: config.Network.TcpClientTag,
		TcpServerTag: config.Network.TcpServerTag,
		UdpTag:       config.Network.UdpTag,
		Mtu:          config.Network.Mtu,
		Interface:    config.Network.Interface,
	}
}

func getPipesConfig(config Config) pipe.Config {
	return pipe.Config{
		TcpClientTag:    config.Network.TcpClientTag,
		TcpServerTag:    config.Network.TcpServerTag,
		Mtu:             config.Network.Mtu,
		KeepAliveProbes: config.Network.KeepAliveProbes,
	}
}

func getPacketToValuesNames(info info.Info, boards []pod_data.Board) (map[uint16][]string, error) {
	names := make(map[uint16][]string)
	for _, board := range boards {
		for _, packet := range board.Packets {
			names[packet.Id] = getNamesFromValues(packet.Measurements)
		}
	}

	return names, nil
}

func getNamesFromValues(measurements []pod_data.Measurement) []string {
	names := make([]string, len(measurements))
	for i, m := range measurements {
		names[i] = m.GetId()
	}
	return names
}

func getIdToBoard(boards []pod_data.Board, trace zerolog.Logger) map[uint16]string {
	idToBoard := make(map[uint16]string)
	for _, board := range boards {
		for _, packet := range board.Packets {
			idToBoard[packet.Id] = board.Name
		}
	}
	return idToBoard
}

func getBoardIdsFromType(boards []pod_data.Board, kind string, trace zerolog.Logger) common.Set[uint16] {
	ids := common.NewSet[uint16]()

	for _, board := range boards {
		for _, packet := range board.Packets {
			if packet.Type == kind {
				ids.Add(packet.Id)
			}
		}
	}

	return ids
}
