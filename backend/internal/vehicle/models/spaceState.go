package models

import (
	"bytes"
	"encoding/binary"
)

type StateSpace [8][15]float32

func NewStateSpace(buf []byte) StateSpace {
	spaceState := StateSpace{}
	r := bytes.NewBuffer(buf)
	//TODO: check endianess
	binary.Read(r, binary.LittleEndian, &spaceState)

	return spaceState
}
