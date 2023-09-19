package packet

import "time"

type Packet struct {
	Metadata Metadata
	Payload  []byte
}

type Metadata struct {
	From      string
	To        string
	ID        uint16
	Timestamp time.Time
	// TODO: generate a synthetic seq num for udp data
	SeqNum uint32
}

func NewMetaData(from, to string, id uint16, seqNum uint32, timestamp time.Time) Metadata {
	return Metadata{
		From:      from,
		To:        to,
		ID:        id,
		Timestamp: timestamp,
		SeqNum:    seqNum,
	}
}
