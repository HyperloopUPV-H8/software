package pipe

import (
	"encoding/binary"
	"errors"
	"net"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/HyperloopUPV-H8/h9-backend/internal/packet"
	"github.com/rs/zerolog"
)

const IdSize = 2

type Pipe struct {
	conn *net.TCPConn

	laddr *net.TCPAddr
	raddr *net.TCPAddr

	readers map[uint16]common.ReaderFrom

	isClosed bool
	mtu      int

	output             chan<- packet.Packet
	onConnectionChange func(bool)

	keepaliveInterval *time.Duration
	writeTiemout      *time.Duration

	trace zerolog.Logger
}

func (pipe *Pipe) connect() {
	pipe.trace.Debug().Msg("connecting")
	dialer := net.Dialer{
		LocalAddr: pipe.laddr,
	}

	for pipe.isClosed {
		pipe.trace.Trace().Msg("dial")

		if pipe.writeTiemout != nil {
			dialer.Deadline = time.Now().Add(*pipe.writeTiemout)
		}

		if conn, err := dialer.Dial("tcp", pipe.raddr.String()); err == nil {
			pipe.open(conn.(*net.TCPConn))
		} else {
			pipe.trace.Trace().Stack().Err(err).Msg("dial failed")
		}
	}
	pipe.trace.Info().Msg("connected")

	go pipe.listen()
}

func (pipe *Pipe) keepalive(interval *time.Duration) {
	ticker := time.NewTicker(*interval)
	for range ticker.C {
		_, err := pipe.Write([]byte{0x45, 0x00})
		if err != nil {
			pipe.Close(true)
			return
		}
	}

}

func (pipe *Pipe) open(conn *net.TCPConn) {
	pipe.trace.Debug().Msg("open")
	pipe.conn = conn
	pipe.isClosed = false
	pipe.conn.SetNoDelay(true)
	pipe.onConnectionChange(!pipe.isClosed)
	if pipe.keepaliveInterval != nil {
		go pipe.keepalive(pipe.keepaliveInterval)
	}
}

func (pipe *Pipe) listen() {
	pipe.trace.Info().Msg("start listening")
	for {
		idBuf := make([]byte, IdSize)
		_, err := pipe.conn.Read(idBuf)

		if err != nil {
			pipe.trace.Error().Stack().Err(err).Msg("")
			pipe.Close(true)
			return
		}

		id := binary.LittleEndian.Uint16(idBuf)

		if id == 69 {
			continue
		}

		reader, ok := pipe.readers[id]

		if !ok {
			pipe.trace.Error().Uint16("id", id).Msg("unknown id")
			continue
		}

		payloadBuf, err := reader.ReadFrom(pipe.conn)

		if err != nil {
			pipe.trace.Error().Stack().Err(err).Msg("")
			pipe.Close(true)
			return
		}

		if pipe.output == nil {
			pipe.trace.Debug().Msg("no output configured")
			continue
		}

		pipe.trace.Trace().Msg("new message")

		totalMsg := make([]byte, 0)
		totalMsg = append(totalMsg, idBuf...)
		totalMsg = append(totalMsg, payloadBuf...)

		raw := pipe.getRaw(totalMsg)
		pipe.output <- raw
	}
}

var syntheticSeqNum uint32 = 0

func (pipe *Pipe) getRaw(payload []byte) packet.Packet {
	syntheticSeqNum++
	return packet.Packet{
		Metadata: packet.NewMetaData(pipe.raddr.String(), pipe.laddr.String(), binary.LittleEndian.Uint16(payload[0:2]), syntheticSeqNum, time.Now()),
		Payload:  payload[2:],
	}
}

func (pipe *Pipe) SendFault(from string, payload []byte) {
	if from == pipe.raddr.String() {
		return
	}

	pipe.Write(append([]byte{0x02, 0x00}, payload...))
}

func (pipe *Pipe) Write(data []byte) (int, error) {
	if pipe == nil || pipe.conn == nil {
		err := errors.New("pipe is nil")
		pipe.trace.Error().Stack().Err(err).Msg("")
		return 0, err
	}

	pipe.trace.Trace().Msg("write")
	if pipe.writeTiemout != nil {
		pipe.conn.SetWriteDeadline(time.Now().Add(*pipe.writeTiemout))
	}
	return pipe.conn.Write(data)
}

func (pipe *Pipe) Close(reconnect bool) error {
	pipe.trace.Warn().Bool("reconnect", reconnect).Msg("close")

	err := pipe.conn.Close()
	pipe.isClosed = err == nil
	pipe.onConnectionChange(!pipe.isClosed)

	if reconnect {
		go pipe.connect()
	}
	return err
}

func (pipe *Pipe) Laddr() string {
	return pipe.laddr.String()
}

func (pipe *Pipe) Raddr() string {
	return pipe.raddr.String()
}
