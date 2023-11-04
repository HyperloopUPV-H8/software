package main

import (
	"bufio"
	"flag"
	"fmt"
	"net"
	"os"
	"os/signal"
	"path"
	"runtime"
	"strings"

	blcuPackage "github.com/HyperloopUPV-H8/h9-backend/internal/blcu"
	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/HyperloopUPV-H8/h9-backend/internal/connection_transfer"
	"github.com/HyperloopUPV-H8/h9-backend/internal/data_transfer"
	"github.com/HyperloopUPV-H8/h9-backend/internal/excel"
	"github.com/HyperloopUPV-H8/h9-backend/internal/excel/ade"
	"github.com/HyperloopUPV-H8/h9-backend/internal/info"
	"github.com/HyperloopUPV-H8/h9-backend/internal/logger_handler"
	protection_logger "github.com/HyperloopUPV-H8/h9-backend/internal/message_logger"
	"github.com/HyperloopUPV-H8/h9-backend/internal/message_transfer"
	"github.com/HyperloopUPV-H8/h9-backend/internal/order_logger"
	"github.com/HyperloopUPV-H8/h9-backend/internal/order_transfer"
	"github.com/HyperloopUPV-H8/h9-backend/internal/packet_logger"
	"github.com/HyperloopUPV-H8/h9-backend/internal/pod_data"
	"github.com/HyperloopUPV-H8/h9-backend/internal/server"
	"github.com/HyperloopUPV-H8/h9-backend/internal/state_space_logger"
	"github.com/HyperloopUPV-H8/h9-backend/internal/update_factory"
	"github.com/HyperloopUPV-H8/h9-backend/internal/value_logger"
	"github.com/HyperloopUPV-H8/h9-backend/internal/vehicle"
	"github.com/HyperloopUPV-H8/h9-backend/internal/vehicle/message_parser"
	vehicle_models "github.com/HyperloopUPV-H8/h9-backend/internal/vehicle/models"
	"github.com/HyperloopUPV-H8/h9-backend/internal/ws_handle"
	"github.com/fatih/color"
	"github.com/google/gopacket/pcap"
	"github.com/pelletier/go-toml/v2"
	trace "github.com/rs/zerolog/log"
)

var traceLevel = flag.String("trace", "info", "set the trace level (\"fatal\", \"error\", \"warn\", \"info\", \"debug\", \"trace\")")
var traceFile = flag.String("log", "trace.json", "set the trace log file")

func main() {
	traceFile := initTrace(*traceLevel, *traceFile)
	defer traceFile.Close()

	pidPath := path.Join(os.TempDir(), "backendPid")

	createPid(pidPath)
	defer RemovePid(pidPath)

	runtime.GOMAXPROCS(runtime.NumCPU())
	flag.Parse()

	config := getConfig("./config.toml")

	// excelAdapter := excel_adapter.New(config.Excel)
	// boards := excelAdapter.GetBoards()
	// globalInfo := excelAdapter.GetGlobalInfo()

	file, err := excel.Download(excel.DownloadConfig(config.Excel.Download))

	if err != nil {
		trace.Fatal().Err(err).Msg("downloading file")
	}

	ade, err := ade.CreateADE(file)

	if err != nil {
		trace.Fatal().Err(err).Msg("creating ade")
	}

	info, err := info.NewInfo(ade.Info)

	if err != nil {
		trace.Fatal().Err(err).Msg("creating info")
	}

	podData, err := pod_data.NewPodData(ade.Boards, info.Units)

	if err != nil {
		fmt.Println(err)
		trace.Fatal().Err(err).Msg("creating podData")
	}

	dataOnlyPodData := pod_data.GetDataOnlyPodData(podData)

	dev, err := selectDev()
	if err != nil {
		trace.Fatal().Err(err).Msg("Error selecting device")
		panic(err)
	}
	config.Vehicle.Network.Interface = dev.Name

	connectionTransfer := connection_transfer.New(config.Connections)

	vehicleOrders, err := vehicle_models.NewVehicleOrders(podData.Boards, config.Excel.Parse.Global.BLCUAddressKey)

	if err != nil {
		trace.Fatal().Err(err).Msg("creating vehicleOrders")
	}

	orderTransfer, orderChannel := order_transfer.New()

	vehicle := vehicle.New(vehicle.VehicleConstructorArgs{
		PodData: podData,
		Config:  config.Vehicle,
		Boards:  podData.Boards,
		Info:    info,
		OnConnectionChange: func(board string, isConnected bool) {
			if !isConnected {
				orderTransfer.ClearOrders(board)
			}
			connectionTransfer.Update(board, isConnected)
		},
	})

	var blcu blcuPackage.BLCU
	blcuAddr, useBlcu := info.Addresses.Boards["BLCU"]

	if useBlcu {
		blcu = blcuPackage.NewBLCU(net.TCPAddr{
			IP:   blcuAddr,
			Port: int(info.Ports.TFTP),
		}, info.BoardIds, config.BLCU)

		blcu.SetSendOrder(vehicle.SendOrder)
	}

	vehicleUpdates := make(chan vehicle_models.PacketUpdate, 1)
	vehicleProtections := make(chan any)
	vehicleTransmittedOrders := make(chan vehicle_models.PacketUpdate)
	blcuAckChan := make(chan struct{})
	stateOrdersChan := make(chan message_parser.StateOrdersAdapter)
	stateSpaceChan := make(chan vehicle_models.StateSpace)

	dataTransfer := data_transfer.New(config.DataTransfer)
	go dataTransfer.Run()

	messageTransfer := message_transfer.New(config.Messages)

	packetLogger := packet_logger.NewPacketLogger(podData.Boards, config.PacketLogger)
	valueLogger := value_logger.NewValueLogger(podData.Boards, config.ValueLogger)
	orderLogger := order_logger.NewOrderLogger(podData.Boards, config.OrderLogger)
	protectionLogger := protection_logger.NewMessageLogger(config.Vehicle.Messages.InfoIdKey, config.Vehicle.Messages.FaultIdKey, config.Vehicle.Messages.WarningIdKey, config.ProtectionLogger)
	stateSpaceLogger := state_space_logger.NewStateSpaceLogger(info.MessageIds.StateSpace)

	loggers := map[string]logger_handler.Logger{
		"packets":     &packetLogger,
		"values":      &valueLogger,
		"orders":      &orderLogger,
		"protections": &protectionLogger,
		"stateSpace":  &stateSpaceLogger,
	}

	loggerHandler := logger_handler.NewLoggerHandler(loggers, config.LoggerHandler)

	websocketBroker := ws_handle.New()
	defer websocketBroker.Close()

	if useBlcu {
		websocketBroker.RegisterHandle(&blcu, config.BLCU.Topics.Upload, config.BLCU.Topics.Download)
	}

	websocketBroker.RegisterHandle(&connectionTransfer, config.Connections.UpdateTopic, "connection/update")
	websocketBroker.RegisterHandle(&dataTransfer, "podData/update")
	websocketBroker.RegisterHandle(&loggerHandler, config.LoggerHandler.Topics.Enable)
	websocketBroker.RegisterHandle(&messageTransfer, "message/update")
	websocketBroker.RegisterHandle(&orderTransfer, config.Orders.SendTopic, "order/stateOrders")

	go vehicle.Listen(vehicleUpdates, vehicleTransmittedOrders, vehicleProtections, blcuAckChan, stateOrdersChan, stateSpaceChan)

	go startPacketUpdateRoutine(vehicleUpdates, &dataTransfer, &loggerHandler)
	go startMessagesRoutine(vehicleProtections, &messageTransfer, &loggerHandler)
	go startOrderRoutine(orderChannel, &vehicle, &loggerHandler)

	go func() {
		for order := range vehicleTransmittedOrders {
			loggable := order_logger.LoggableTransmittedOrder(order)
			loggerHandler.Log(loggable)
		}
	}()

	if useBlcu {
		go func() {
			for range blcuAckChan {
				blcu.NotifyAck()
			}
		}()
	}

	go func() {
		for stateSpace := range stateSpaceChan {
			for _, row := range stateSpace {
				loggerHandler.Log(state_space_logger.LoggableStateSpaceRow(row))
			}

		}
	}()

	go func() {
		for stateOrders := range stateOrdersChan {
			switch stateOrders.Action {
			case message_parser.AddStateOrderKind:
				orderTransfer.AddStateOrders(stateOrders.StateOrders)
			case message_parser.RemoveStateOrderKind:
				orderTransfer.RemoveStateOrders(stateOrders.StateOrders)
			}
		}
	}()

	uploadableBords := common.Filter(common.Keys(info.Addresses.Boards), func(item string) bool {
		return item != config.Excel.Parse.Global.BLCUAddressKey
	})

	endpointData := server.EndpointData{
		PodData:           dataOnlyPodData,
		OrderData:         vehicleOrders,
		ProgramableBoards: uploadableBords,
	}

	serverHandler, err := server.New(&websocketBroker, endpointData, config.Server)
	if err != nil {
		trace.Fatal().Err(err).Msg("Error creating server")
		panic(err)
	}

	errs := serverHandler.ListenAndServe()

	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)

	for {
		select {
		case err := <-errs:
			trace.Error().Err(err).Msg("Error in server")

		case <-interrupt:
			trace.Info().Msg("Shutting down")
			return
		}
	}
}

func createPid(path string) {
	err := WritePid(path)

	if err != nil {
		switch err {
		case ErrProcessRunning:
			trace.Fatal().Err(err).Msg("Backend is already running")
		default:
			trace.Error().Err(err).Msg("pid error")
		}
	}
}

func selectDev() (pcap.Interface, error) {
	devs, err := pcap.FindAllDevs()
	if err != nil {
		return pcap.Interface{}, err
	}

	cyan := color.New(color.FgCyan)

	cyan.Print("select a device: ")
	fmt.Printf("(0-%d)\n", len(devs)-1)
	for i, dev := range devs {
		displayDev(i, dev)
	}

	dev, err := acceptInput(len(devs))
	if err != nil {
		return pcap.Interface{}, err
	}

	return devs[dev], nil
}

func displayDev(i int, dev pcap.Interface) {
	red := color.New(color.FgRed)
	green := color.New(color.FgGreen)
	yellow := color.New(color.FgYellow)

	red.Printf("\t%d", i)
	fmt.Print(": (")
	yellow.Print(dev.Name)
	fmt.Printf(") %s [", dev.Description)
	for _, addr := range dev.Addresses {
		green.Printf("%s", addr.IP)
		fmt.Print(", ")
	}
	fmt.Println("]")
}

func acceptInput(limit int) (int, error) {
	blue := color.New(color.FgBlue)
	red := color.New(color.FgRed)

	for {
		blue.Print(">>> ")

		reader := bufio.NewReader(os.Stdin)
		input, err := reader.ReadString('\n')
		if err != nil {
			return 0, err
		}

		var dev int
		_, err = fmt.Sscanf(input, "%d", &dev)
		if err != nil {
			red.Printf("%s\n\n", err)
			continue
		}

		if dev < 0 || dev >= limit {
			red.Println("invalid device selected")
			continue
		} else {
			return dev, nil
		}
	}
}

func getConfig(path string) Config {
	configFile, fileErr := os.ReadFile(path)

	if fileErr != nil {
		trace.Fatal().Stack().Err(fileErr).Msg("error reading config file")
	}

	reader := strings.NewReader(string(configFile))

	var config Config

	// TODO: add strict mode (DisallowUnkownFields)
	decodeErr := toml.NewDecoder(reader).Decode(&config)

	if decodeErr != nil {
		trace.Fatal().Stack().Err(decodeErr).Msg("error unmarshaling toml file")
	}

	return config
}

func startPacketUpdateRoutine(vehicleUpdates <-chan vehicle_models.PacketUpdate, dataTransfer *data_transfer.DataTransfer, loggerHandler *logger_handler.LoggerHandler) {
	updateFactory := update_factory.NewFactory()

	for packetUpdate := range vehicleUpdates {
		update := updateFactory.NewUpdate(packetUpdate)
		dataTransfer.Update(update)

		loggerHandler.Log(packet_logger.ToLoggablePacket(packetUpdate))

		for id, value := range packetUpdate.Values {
			loggerHandler.Log(value_logger.ToLoggableValue(id, value, packetUpdate.Metadata.Timestamp))
		}
	}
}

func startMessagesRoutine(vehicleMessages <-chan any, messageTransfer *message_transfer.MessageTransfer, loggerHandler *logger_handler.LoggerHandler) {
	for message := range vehicleMessages {
		messageTransfer.SendMessage(message)

		switch msg := message.(type) {
		case vehicle_models.InfoMessage:
			loggerHandler.Log(protection_logger.LoggableInfo(msg))
		case vehicle_models.ProtectionMessage:
			loggerHandler.Log(protection_logger.LoggableProtection(msg))
		}
	}
}

func startOrderRoutine(orderChannel <-chan vehicle_models.Order, vehicle *vehicle.Vehicle, loggerHandler *logger_handler.LoggerHandler) {
	for ord := range orderChannel {
		err := vehicle.SendOrder(ord)

		if err != nil {
			trace.Error().Any("order", ord).Msg("error sending order")
		}

		loggerHandler.Log(order_logger.LoggableOrder(ord))
	}
}
