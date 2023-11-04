package state_space_logger

import "fmt"

type LoggableStateSpaceRow [15]float32

func (lo LoggableStateSpaceRow) Id() string {
	return "7"
}

func (lo LoggableStateSpaceRow) Log() []string {
	logSlice := make([]string, 15)

	for index, item := range lo {
		logSlice[index] = fmt.Sprint(item)
	}

	return logSlice
}
