package info

import (
	"fmt"
	"net"
	"strconv"

	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/HyperloopUPV-H8/h9-backend/internal/excel/ade"
	"github.com/HyperloopUPV-H8/h9-backend/internal/excel/utils"
)

//FIXME: get this value from config

const BackendKey = "Backend"

func NewInfo(adeInfo ade.Info) (Info, error) {
	infoErrs := common.NewErrorList()

	addresses, err := parseAddresses(adeInfo.Addresses)

	if err != nil {
		infoErrs.Add(err)
	}

	units, err := parseUnitsTable(adeInfo.Units)

	if err != nil {
		infoErrs.Add(err)
	}

	ports, err := parsePorts(adeInfo.Ports)

	if err != nil {
		infoErrs.Add(err)
	}

	boardIds, err := parseUint16Table(adeInfo.BoardIds)

	if err != nil {
		infoErrs.Add(err)
	}

	messageIds, err := parseMessages(adeInfo.MessageIds)

	if err != nil {
		infoErrs.Add(err)
	}

	if len(infoErrs) > 0 {
		return Info{}, infoErrs
	}

	return Info{
		Addresses:  addresses,
		Units:      units,
		Ports:      ports,
		BoardIds:   boardIds,
		MessageIds: messageIds,
	}, nil
}

func parseAddresses(addrTable map[string]string) (Addresses, error) {
	addresses := make(map[string]net.IP, len(addrTable))
	addrErrors := common.NewErrorList()
	for key, ipStr := range addrTable {
		ip := net.ParseIP(ipStr)
		if ip == nil {
			addrErrors.Add(fmt.Errorf("%s is not a valid ip", ipStr))
			continue
		}

		addresses[key] = ip
	}

	backendIp, ok := addresses[BackendKey]

	if !ok {
		addrErrors.Add(fmt.Errorf("backend ip not found"))
	}

	if len(addrErrors) > 0 {
		return Addresses{}, addrErrors
	}

	return Addresses{
		Backend: backendIp,
		Boards: common.FilterMap(addresses, func(name string, ip net.IP) bool {
			return name != BackendKey
		}),
	}, nil
}

func parseUnitsTable(unitsTable map[string]string) (map[string]utils.Operations, error) {
	units := make(map[string]utils.Operations, len(unitsTable))
	unitsErr := common.NewErrorList()

	for name, opStr := range unitsTable {
		operations, err := utils.NewOperations(opStr)

		if err != nil {
			unitsErr.Add(err)
			continue
		}

		units[name] = operations
	}

	if len(unitsErr) > 0 {
		return nil, unitsErr
	}

	return units, nil
}

func parseMessages(messagesTable map[string]string) (MessageIds, error) {
	messageErrs := common.NewErrorList()

	faultId, err := getUint16(messagesTable, "fault")

	if err != nil {
		messageErrs.Add(err)
	}

	warningId, err := getUint16(messagesTable, "warning")

	if err != nil {
		messageErrs.Add(err)
	}

	infoId, err := getUint16(messagesTable, "info")

	if err != nil {
		messageErrs.Add(err)
	}

	blcuAckId, err := getUint16(messagesTable, "blcu_ack")

	if err != nil {
		messageErrs.Add(err)
	}

	addStateOrdersId, err := getUint16(messagesTable, "add_state_orders")

	if err != nil {
		messageErrs.Add(err)
	}

	removeStateOrdersId, err := getUint16(messagesTable, "remove_state_orders")

	if err != nil {
		messageErrs.Add(err)
	}

	stateSpace, err := getUint16(messagesTable, "state_space")

	if err != nil {
		messageErrs.Add(err)
	}

	if len(messageErrs) > 0 {
		return MessageIds{}, messageErrs
	}

	return MessageIds{
		Info:             infoId,
		Warning:          warningId,
		Fault:            faultId,
		BlcuAck:          blcuAckId,
		AddStateOrder:    addStateOrdersId,
		RemoveStateOrder: removeStateOrdersId,
		StateSpace:       stateSpace,
	}, nil
}

func parsePorts(portsTable map[string]string) (Ports, error) {
	portsErrs := common.NewErrorList()

	tcpServer, err := getUint16(portsTable, "TCP_SERVER")

	if err != nil {
		portsErrs.Add(err)
	}

	tcpClient, err := getUint16(portsTable, "TCP_CLIENT")

	if err != nil {
		portsErrs.Add(err)
	}

	udp, err := getUint16(portsTable, "UDP")

	if err != nil {
		portsErrs.Add(err)
	}

	tftp, err := getUint16(portsTable, "TFTP")

	if err != nil {
		portsErrs.Add(err)
	}

	sntp, err := getUint16(portsTable, "SNTP")

	if err != nil {
		portsErrs.Add(err)
	}

	if len(portsErrs) > 0 {
		return Ports{}, portsErrs
	}

	return Ports{
		UDP:       udp,
		TcpServer: tcpServer,
		TcpClient: tcpClient,
		TFTP:      tftp,
		SNTP:      sntp,
	}, nil
}

func getUint16(kindToId map[string]string, key string) (uint16, error) {
	numStr, ok := kindToId[key]

	if !ok {
		return 0, fmt.Errorf("kind not found: %s", key)
	}

	num, err := strconv.ParseUint(numStr, 10, 16)

	if err != nil {
		return 0, fmt.Errorf("error parsing id as uint16: %s", numStr)
	}

	return uint16(num), nil
}

func parseUint16Table(table map[string]string) (map[string]uint16, error) {
	nums := make(map[string]uint16, 0)
	numErrs := common.NewErrorList()
	for key, portStr := range table {
		num, err := strconv.ParseInt(portStr, 10, 16)

		if err != nil {
			numErrs.Add(err)
			continue
		}

		nums[key] = uint16(num)
	}

	if len(numErrs) > 0 {
		return nil, numErrs
	}

	return nums, nil
}
