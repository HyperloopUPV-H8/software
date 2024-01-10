package protection

import (
	"encoding/binary"
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

var formatMatrix = map[Format]map[Bound](func() data){
	IntFormat: {
		BelowBound:            newBelow[int32],
		AboveBound:            newAbove[int32],
		OutOfBoundsBound:      newOutOfBounds[int32],
		EqualsBound:           newEquals[int32],
		NotEqualsBound:        newNotEquals[int32],
		ErrorHandlerBound:     newErrorHandler,
		TimeAccumulationBound: newTimeAccumulation[int32],
	},
	FloatFormat: {
		BelowBound:            newBelow[float32],
		AboveBound:            newAbove[float32],
		OutOfBoundsBound:      newOutOfBounds[float32],
		EqualsBound:           newEquals[float32],
		NotEqualsBound:        newNotEquals[float32],
		ErrorHandlerBound:     newErrorHandler,
		TimeAccumulationBound: newTimeAccumulation[float32],
	},
	DoubleFormat: {
		BelowBound:            newBelow[float64],
		AboveBound:            newAbove[float64],
		OutOfBoundsBound:      newOutOfBounds[float64],
		EqualsBound:           newEquals[float64],
		NotEqualsBound:        newNotEquals[float64],
		ErrorHandlerBound:     newErrorHandler,
		TimeAccumulationBound: newTimeAccumulation[float64],
	},
	CharFormat: {
		BelowBound:            newBelow[byte],
		AboveBound:            newAbove[byte],
		OutOfBoundsBound:      newOutOfBounds[byte],
		EqualsBound:           newEquals[byte],
		NotEqualsBound:        newNotEquals[byte],
		ErrorHandlerBound:     newErrorHandler,
		TimeAccumulationBound: newTimeAccumulation[byte],
	},
	BoolFormat: {
		BelowBound:            newBelow[bool],
		AboveBound:            newAbove[bool],
		OutOfBoundsBound:      newOutOfBounds[bool],
		EqualsBound:           newEquals[bool],
		NotEqualsBound:        newNotEquals[bool],
		ErrorHandlerBound:     newErrorHandler,
		TimeAccumulationBound: newTimeAccumulation[bool],
	},
	ShortFormat: {
		BelowBound:            newBelow[int16],
		AboveBound:            newAbove[int16],
		OutOfBoundsBound:      newOutOfBounds[int16],
		EqualsBound:           newEquals[int16],
		NotEqualsBound:        newNotEquals[int16],
		ErrorHandlerBound:     newErrorHandler,
		TimeAccumulationBound: newTimeAccumulation[int16],
	},
	LongFormat: {
		BelowBound:            newBelow[int64],
		AboveBound:            newAbove[int64],
		OutOfBoundsBound:      newOutOfBounds[int64],
		EqualsBound:           newEquals[int64],
		NotEqualsBound:        newNotEquals[int64],
		ErrorHandlerBound:     newErrorHandler,
		TimeAccumulationBound: newTimeAccumulation[int64],
	},
	Uint8Format: {
		BelowBound:            newBelow[uint8],
		AboveBound:            newAbove[uint8],
		OutOfBoundsBound:      newOutOfBounds[uint8],
		EqualsBound:           newEquals[uint8],
		NotEqualsBound:        newNotEquals[uint8],
		ErrorHandlerBound:     newErrorHandler,
		TimeAccumulationBound: newTimeAccumulation[uint8],
	},
	Uint16Format: {
		BelowBound:            newBelow[uint16],
		AboveBound:            newAbove[uint16],
		OutOfBoundsBound:      newOutOfBounds[uint16],
		EqualsBound:           newEquals[uint16],
		NotEqualsBound:        newNotEquals[uint16],
		ErrorHandlerBound:     newErrorHandler,
		TimeAccumulationBound: newTimeAccumulation[uint16],
	},
	Uint32Format: {
		BelowBound:            newBelow[uint32],
		AboveBound:            newAbove[uint32],
		OutOfBoundsBound:      newOutOfBounds[uint32],
		EqualsBound:           newEquals[uint32],
		NotEqualsBound:        newNotEquals[uint32],
		ErrorHandlerBound:     newErrorHandler,
		TimeAccumulationBound: newTimeAccumulation[uint32],
	},
	Uint64Format: {
		BelowBound:            newBelow[uint64],
		AboveBound:            newAbove[uint64],
		OutOfBoundsBound:      newOutOfBounds[uint64],
		EqualsBound:           newEquals[uint64],
		NotEqualsBound:        newNotEquals[uint64],
		ErrorHandlerBound:     newErrorHandler,
		TimeAccumulationBound: newTimeAccumulation[uint64],
	},
	Int8Format: {
		BelowBound:            newBelow[int8],
		AboveBound:            newAbove[int8],
		OutOfBoundsBound:      newOutOfBounds[int8],
		EqualsBound:           newEquals[int8],
		NotEqualsBound:        newNotEquals[int8],
		ErrorHandlerBound:     newErrorHandler,
		TimeAccumulationBound: newTimeAccumulation[int8],
	},
}

// Decoder decodes protection messages
type Decoder struct {
	endianness   binary.ByteOrder
	idToSeverity map[abstraction.PacketId]Severity
}

// TODO: improve constructor
// NewDecoder creates a new Decoder
func NewDecoder(endianness binary.ByteOrder) *Decoder {
	return &Decoder{
		endianness:   endianness,
		idToSeverity: make(map[abstraction.PacketId]Severity),
	}
}

// SetSeverity sets the severity level for the given ID
func (decoder *Decoder) SetSeverity(id abstraction.PacketId, severity Severity) {
	decoder.idToSeverity[id] = severity
}

// Decode decodes the next protection message from the reader using json
func (decoder *Decoder) Decode(id abstraction.PacketId, reader io.Reader) (abstraction.Packet, error) {
	severity, ok := decoder.idToSeverity[id]
	if !ok {
		return nil, ErrUnknownSeverity{Id: id}
	}

	packet := NewPacket(id)

	err := binary.Read(reader, decoder.endianness, &packet.formatId)
	if err != nil {
		return packet, err
	}

	err = binary.Read(reader, decoder.endianness, &packet.boundType)
	if err != nil {
		return packet, err
	}

	packet.name, err = readCString(reader)
	if err != nil {
		return packet, err
	}

	dataConstructor, ok := formatMatrix[packet.formatId][packet.boundType]
	if !ok {
		return packet, ErrUnknownBound{Bound: packet.boundType}
	}

	packet.data = dataConstructor()
	err = packet.data.Decode(decoder.endianness, reader)
	if err != nil {
		return packet, err
	}

	err = packet.timestamp.Decode(decoder.endianness, reader)
	if err != nil {
		return packet, err
	}

	switch severity {
	case WarningSeverity:
		return (*Warning)(packet), nil
	case FaultSeverity:
		return (*Fault)(packet), nil
	default:
		return packet, ErrUnknownSeverity{Id: id}
	}
}

func readCString(reader io.Reader) (string, error) {
	data := make([]byte, 0)
	read := make([]byte, 1)
	var readErr error
	var n int
	for {
		n, readErr = reader.Read(read)
		if n < 1 || read[0] == 0 {
			break
		}
		data = append(data, read[0])
	}
	return string(data), readErr
}
