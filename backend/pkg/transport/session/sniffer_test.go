package session_test

import (
	"errors"
	"io"
	"os"
	"sync"
	"testing"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/session"
	"github.com/rs/zerolog"
)

type testInputChunk struct {
	socket network.Socket
	data   string
}

type testInput []testInputChunk

type testInputAdapter struct {
	chunks testInput
	curr   int
}

func (input *testInputAdapter) ReadNext() (network.Payload, error) {
	if input.curr >= len(input.chunks) {
		return network.Payload{}, errors.New("no more packets to read")
	}

	chunk := input.chunks[input.curr]
	input.curr++
	return network.Payload{
		Socket:    chunk.socket,
		Data:      []byte(chunk.data),
		Timestamp: time.Now(),
	}, nil
}

type testOutput = map[network.Socket]string

type testcase struct {
	name   string
	input  testInput
	output testOutput
}

func TestSnifferDemux(t *testing.T) {

	tests := []testcase{
		{
			name: "basic message",
			input: testInput{
				{
					network.Socket{
						SrcIP:   "127.0.0.1",
						SrcPort: 3000,
						DstIP:   "127.0.0.1",
						DstPort: 3001,
					},
					"Hello, world!",
				},
			},
			output: testOutput{
				network.Socket{
					SrcIP:   "127.0.0.1",
					SrcPort: 3000,
					DstIP:   "127.0.0.1",
					DstPort: 3001,
				}: "Hello, world!",
			},
		},
		{
			name: "multiple messages",
			input: testInput{
				{
					network.Socket{
						SrcIP:   "127.0.0.1",
						SrcPort: 3000,
						DstIP:   "127.0.0.1",
						DstPort: 3001,
					},
					"a",
				},
				{
					network.Socket{
						SrcIP:   "127.0.0.1",
						SrcPort: 3000,
						DstIP:   "127.0.0.1",
						DstPort: 3001,
					},
					"b",
				},
				{
					network.Socket{
						SrcIP:   "127.0.0.1",
						SrcPort: 3000,
						DstIP:   "127.0.0.1",
						DstPort: 3001,
					},
					"c",
				},
			},
			output: testOutput{
				network.Socket{
					SrcIP:   "127.0.0.1",
					SrcPort: 3000,
					DstIP:   "127.0.0.1",
					DstPort: 3001,
				}: "abc",
			},
		},
		{
			name: "multiple sockets",
			input: testInput{
				{
					network.Socket{
						SrcIP:   "127.0.0.1",
						SrcPort: 3000,
						DstIP:   "127.0.0.1",
						DstPort: 3001,
					},
					"a",
				},
				{
					network.Socket{
						SrcIP:   "127.0.0.2",
						SrcPort: 3000,
						DstIP:   "127.0.0.1",
						DstPort: 3001,
					},
					"b",
				},
				{
					network.Socket{
						SrcIP:   "127.0.0.3",
						SrcPort: 3000,
						DstIP:   "127.0.0.1",
						DstPort: 3001,
					},
					"c",
				},
			},
			output: testOutput{
				network.Socket{
					SrcIP:   "127.0.0.1",
					SrcPort: 3000,
					DstIP:   "127.0.0.1",
					DstPort: 3001,
				}: "a",
				network.Socket{
					SrcIP:   "127.0.0.2",
					SrcPort: 3000,
					DstIP:   "127.0.0.1",
					DstPort: 3001,
				}: "b",
				network.Socket{
					SrcIP:   "127.0.0.3",
					SrcPort: 3000,
					DstIP:   "127.0.0.1",
					DstPort: 3001,
				}: "c",
			},
		},
		{
			name: "multiple sockets, multiple messages",
			input: testInput{
				{
					network.Socket{
						SrcIP:   "127.0.0.1",
						SrcPort: 3000,
						DstIP:   "127.0.0.1",
						DstPort: 3001,
					},
					"a",
				},
				{
					network.Socket{
						SrcIP:   "127.0.0.2",
						SrcPort: 3000,
						DstIP:   "127.0.0.1",
						DstPort: 3001,
					},
					"b",
				},
				{
					network.Socket{
						SrcIP:   "127.0.0.1",
						SrcPort: 3000,
						DstIP:   "127.0.0.1",
						DstPort: 3001,
					},
					"c",
				},
			},
			output: testOutput{
				network.Socket{
					SrcIP:   "127.0.0.1",
					SrcPort: 3000,
					DstIP:   "127.0.0.1",
					DstPort: 3001,
				}: "ac",
				network.Socket{
					SrcIP:   "127.0.0.2",
					SrcPort: 3000,
					DstIP:   "127.0.0.1",
					DstPort: 3001,
				}: "b",
			},
		},
	}

	for _, test := range tests {
		t.Run(t.Name(), func(t *testing.T) {
			mapMx := new(sync.Mutex)
			outputMap := make(map[network.Socket]string)

			wg := new(sync.WaitGroup)
			onConversation := func(socket network.Socket, reader io.Reader) {
				wg.Add(1)
				go func(socket network.Socket, reader io.Reader) {
					defer wg.Done()
					buf := make([]byte, 65536)
					timeout := time.After(time.Millisecond)
					readChan := make(chan []byte)
					for {
						go func() {
							for {
								n, err := reader.Read(buf)
								if err != nil {
									close(readChan)
									return
								}
								if n > 0 {
									readChan <- buf[:n]
									return
								}
							}
						}()

						select {
						case <-timeout:
							return
						case buf, ok := <-readChan:
							if !ok {
								return
							}
							mapMx.Lock()
							data := string(buf)
							prev, ok := outputMap[socket]
							if ok {
								data = prev + data
							}
							outputMap[socket] = data
							mapMx.Unlock()
						}

					}
				}(socket, reader)
			}

			logger := zerolog.New(os.Stdout)
			demux, err := session.NewSnifferDemux(onConversation, &logger)

			data := testInputAdapter{test.input, 0}

			go demux.ReadPackets(&data)
			<-err
			wg.Wait()

			if len(outputMap) > len(test.output) {
				for socket, got := range outputMap {
					if _, ok := test.output[socket]; !ok {
						t.Fatalf("Unexpected message from socket %v: %s", socket, got)
					}
					expected := test.output[socket]
					if expected != got {
						t.Fatalf("expected != got for socket %v: (\"%s\" != \"%s\")", socket, expected, got)
					}
				}
			} else {
				for socket, expected := range test.output {
					if _, ok := outputMap[socket]; !ok {
						t.Fatalf("Expected message from socket %v: %s", socket, expected)
					}
					got := outputMap[socket]
					if expected != got {
						t.Fatalf("expected != got for socket %v: (\"%s\" != \"%s\")", socket, expected, got)
					}
				}
			}

		})
	}
}
