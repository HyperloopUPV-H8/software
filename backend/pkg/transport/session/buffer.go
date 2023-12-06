package session

type Buffer struct {
	data chan byte
}

func NewBuffer(size int) *Buffer {
	return &Buffer{
		data: make(chan byte, size),
	}
}

func (buffer *Buffer) Read(b []byte) (n int, err error) {
	n = 0
	ok := true
loop:
	for i := range b {
		b[i], ok = <-buffer.data
		n++
		if !ok {
			break loop
		}
	}

	return n, nil
}

func (buffer *Buffer) Write(b []byte) (n int, err error) {
	n = 0
	for i := range b {
		buffer.data <- b[i]
		n++
	}

	return n, nil
}
