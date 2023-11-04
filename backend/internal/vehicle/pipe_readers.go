package vehicle

import (
	"encoding/binary"
	"fmt"
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/HyperloopUPV-H8/h9-backend/internal/info"
)

func newPipeReaders(messageIds info.MessageIds) map[uint16]common.ReaderFrom {
	return map[uint16]common.ReaderFrom{
		0:                           NewEmptyFrom(),
		messageIds.Info:             NewProtectionFrom(),
		messageIds.Warning:          NewProtectionFrom(),
		messageIds.Fault:            NewProtectionFrom(),
		messageIds.BlcuAck:          NewEmptyFrom(),
		messageIds.AddStateOrder:    NewStateOrderReaderFrom(),
		messageIds.RemoveStateOrder: NewStateOrderReaderFrom(),
		messageIds.StateSpace:       NewStateSpaceReaderFrom(8, 15, 4),
	}
}

func NewProtectionFrom() ProtectionFrom {
	return ProtectionFrom{}
}

type ProtectionFrom struct{}

func (rf ProtectionFrom) ReadFrom(r io.Reader) ([]byte, error) {
	var protectionLen uint16
	err := binary.Read(r, binary.LittleEndian, &protectionLen)
	if err != nil {
		return nil, err
	}

	protectionBuf := make([]byte, protectionLen)
	n, err := r.Read(protectionBuf)
	if err != nil {
		return nil, err
	}

	if n != int(protectionLen) {
		return nil, io.ErrShortBuffer
	}

	return protectionBuf, nil
}

func NewEmptyFrom() EmptyFrom {
	return EmptyFrom{}
}

type EmptyFrom struct{}

func (rf EmptyFrom) ReadFrom(r io.Reader) ([]byte, error) {
	return []byte{}, nil
}

func NewStateOrderReaderFrom() StateOrderReaderFrom {
	return StateOrderReaderFrom{}
}

const OrderNumByteSize = 1
const OrderByteSize = 2

type StateOrderReaderFrom struct{}

func (rf StateOrderReaderFrom) ReadFrom(r io.Reader) ([]byte, error) {
	orderNumBuf := make([]byte, OrderNumByteSize)
	n, err := r.Read(orderNumBuf)

	if n != len(orderNumBuf) {
		return nil, fmt.Errorf("expected %d bytes, got %d", len(orderNumBuf), n)
	}

	if err != nil {
		return nil, err
	}

	orderNum := orderNumBuf[0]

	orderIds := make([]byte, (orderNum * OrderByteSize))
	n, err = r.Read(orderIds)

	if err != nil {
		return nil, err
	}

	if n != len(orderIds) {
		return nil, fmt.Errorf("expected %d bytes, got %d", len(orderIds), n)
	}

	result := append([]byte{orderNum}, orderIds...)

	return result, nil
}

// 8*15 float32

type StateSpaceReaderFrom struct {
	rows         int
	cols         int
	variableSize int
}

func NewStateSpaceReaderFrom(rows int, cols int, varSize int) StateSpaceReaderFrom {
	return StateSpaceReaderFrom{
		rows:         rows,
		cols:         cols,
		variableSize: varSize,
	}
}

func (rf StateSpaceReaderFrom) ReadFrom(r io.Reader) ([]byte, error) {
	size := rf.cols * rf.rows * rf.variableSize
	stateSpaceBuf := make([]byte, size)
	n, err := r.Read(stateSpaceBuf)

	if err != nil {
		return nil, err
	}

	if n != size {
		return nil, fmt.Errorf("incorrect state space size: want %d got %d", size, n)
	}

	return stateSpaceBuf, nil
}
