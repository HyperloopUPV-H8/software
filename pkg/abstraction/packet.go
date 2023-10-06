package abstraction

type PacketId uint16
type Packet interface {
	Id() PacketId
}
