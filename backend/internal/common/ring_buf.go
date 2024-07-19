package common

import "sync"

// RingBuffer is a concurrently safe ring buffer implementation that can be resized anytime
//
// Adding values run in constant time but resizing takes linear time
type RingBuffer[T any] struct {
	data       chan T
	resizeLock *sync.Mutex
}

// Create a new ring buffer of the desired size
func NewRingBuffer[T any](size int) RingBuffer[T] {
	return RingBuffer[T]{
		data:       make(chan T, size),
		resizeLock: new(sync.Mutex),
	}
}

func (buffer RingBuffer[T]) Len() int {
	return cap(buffer.data)
}

// Add adds a new value to the buffer
//
// If the buffer overflowed the value that had to be removed is returned,
// otherwise Add returns the default value
//
// This function runs in constant time
func (buffer RingBuffer[T]) Add(value T) (evicted T) {
	buffer.resizeLock.Lock()
	defer buffer.resizeLock.Unlock()

	select {
	case buffer.data <- value:
	default:
		evicted = <-buffer.data
		buffer.data <- value
	}
	return
}

// Resize resizes the ring buffer
//
// This function retursn the values that were added / removed from the buffer.
// The value returned when growing is the default value.
//
// This function runs in linear time
func (buffer RingBuffer[T]) Resize(size int) (changedValues []T) {
	buffer.resizeLock.Lock()
	defer buffer.resizeLock.Unlock()

	newData := make(chan T, size)
resizeLoop:
	for value := range buffer.data {
		select {
		case newData <- value:
		default:
			break resizeLoop
		}
	}

	if size > cap(buffer.data) {
		changedValues = make([]T, cap(buffer.data)-len(buffer.data))
	} else if size < cap(buffer.data) {
		changedValues = make([]T, 0, len(buffer.data))
		for remaingValue := range buffer.data {
			changedValues = append(changedValues, remaingValue)
		}
	}
	buffer.data = newData

	return
}
