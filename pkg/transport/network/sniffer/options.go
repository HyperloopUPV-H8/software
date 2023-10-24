package sniffer

type options interface {
	Apply(*Sniffer) error
}
