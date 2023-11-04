package pipe

import (
	"fmt"
	"net"
	"os/exec"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/HyperloopUPV-H8/h9-backend/internal/info"
	"github.com/HyperloopUPV-H8/h9-backend/internal/packet"
	"github.com/rs/zerolog"
	trace "github.com/rs/zerolog/log"
)

func contains(boards []string, board string) bool {
	for _, b := range boards {
		if b == board {
			return true
		}
	}
	return false
}

func CreatePipes(info info.Info, keepaliveInterval, writeTimeout *time.Duration, boards []string, dataChan chan<- packet.Packet, onConnectionChange func(string, bool), config Config, readers map[uint16]common.ReaderFrom, trace zerolog.Logger) map[string]*Pipe {
	err := configKeepAliveProbes(config.KeepAliveProbes)

	if err != nil {
		trace.Error().Err(err).Msg("configuring keep alive probes")
	}

	i := 0
	pipes := make(map[string]*Pipe)
	for board, ip := range info.Addresses.Boards {
		ip := ip
		if boards != nil && !contains(boards, board) {
			continue
		}

		raddr := net.TCPAddr{
			IP:   ip,
			Port: int(info.Ports.TcpServer),
		}

		laddr := net.TCPAddr{
			IP:   info.Addresses.Backend,
			Port: int(info.Ports.TcpClient) + i,
		}

		pipe, err := newPipe(laddr, raddr, keepaliveInterval, writeTimeout, config.Mtu, dataChan, readers, getOnConnectionChange(board, onConnectionChange))

		if err != nil {
			//TODO: how to handle this error
			trace.Fatal().Stack().Err(err).Msg("error creating pipe")
		}

		pipes[board] = pipe
		i++
	}

	return pipes
}

func configKeepAliveProbes(n int) error {
	flag := fmt.Sprintf("net.ipv4.tcp_keepalive_probes=%d", n)
	return exec.Command("sysctl", "-w", flag).Run()
}

func newPipe(laddr net.TCPAddr, raddr net.TCPAddr, keepaliveInterval, writeTimeout *time.Duration, mtu uint, outputChan chan<- packet.Packet, readers map[uint16]common.ReaderFrom, onConnectionChange func(bool)) (*Pipe, error) {
	trace.Info().Any("laddr", laddr).Any("raddr", raddr).Msg("new pipe")

	pipe := &Pipe{
		laddr:  &laddr,
		raddr:  &raddr,
		output: outputChan,

		readers: readers,

		isClosed: true,
		mtu:      int(mtu),

		onConnectionChange: onConnectionChange,

		keepaliveInterval: keepaliveInterval,
		writeTiemout:      writeTimeout,

		trace: trace.With().Str("component", "pipe").IPAddr("addr", raddr.IP).Logger(),
	}

	go pipe.connect()

	return pipe, nil
}

func getOnConnectionChange(board string, onConnectionChange func(string, bool)) func(bool) {
	return func(state bool) {
		onConnectionChange(board, state)
	}
}
