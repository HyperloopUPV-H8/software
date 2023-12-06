package protection

import (
	"encoding/json"
	"io"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/abstraction"
)

// protectionAdapter is used as an intermediate step when decoding the protection messages
type protectionAdapter struct {
	Name ProtectionName   `json:"name"`
	Type kind             `json:"type"`
	Data *json.RawMessage `json:"data"`
}

// UnmarshalJSON unmarshals the data in two passes to directly get the ProtectionData field
func (protection *Protection) UnmarshalJSON(data []byte) error {
	var adapter protectionAdapter
	err := json.Unmarshal(data, &adapter)
	if err != nil {
		return err
	}

	protection.Name = adapter.Name
	protection.Type = adapter.Type

	switch adapter.Type {
	case OutOfBoundsKind:
		protection.Data = new(OutOfBounds)
	case UpperBoundKind:
		protection.Data = new(UpperBound)
	case LowerBoundKind:
		protection.Data = new(LowerBound)
	case EqualsKind:
		protection.Data = new(Equals)
	case NotEqualsKind:
		protection.Data = new(NotEquals)
	case TimeAccumulationKind:
		protection.Data = new(TimeAccumulation)
	case ErrorHandlerKind:
		protection.Data = new(ErrorHandler)
	default:
		return ErrUnknownKind{Kind: adapter.Type}
	}

	return json.Unmarshal(*adapter.Data, &protection.Data)
}

type delimiter = byte

// Decoder decodes protection messages
type Decoder struct {
	idToSeverity    map[abstraction.PacketId]severity
	packetDelimiter delimiter
}

// TODO: improve constructor
// NewDecoder creates a new Decoder
func NewDecoder() *Decoder {
	return &Decoder{
		idToSeverity: make(map[abstraction.PacketId]severity),
	}
}

// SetSeverity sets the severity level for the given ID
func (decoder *Decoder) SetSeverity(id abstraction.PacketId, severity severity) {
	decoder.idToSeverity[id] = severity
}

// Decode decodes the next protection message from the reader using json
func (decoder *Decoder) Decode(id abstraction.PacketId, reader io.Reader) (abstraction.Packet, error) {
	severity, ok := decoder.idToSeverity[id]
	if !ok {
		return nil, ErrUnknownSeverity{Id: id}
	}

	packet := NewPacket(id, severity)

	// Read exactly up to the delimiter
	packetBuf := make([]byte, 0)
	readbuf := make([]byte, 1)
	var readErr error
	var n int
	for {
		n, readErr = reader.Read(readbuf)
		if n < 1 || readbuf[0] == decoder.packetDelimiter {
			break
		}
		packetBuf = append(packetBuf, readbuf[0])
	}

	err := json.Unmarshal(packetBuf, &packet)
	if err != nil {
		return packet, err
	}
	return packet, readErr
}
