package tftp_test

import (
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/tftp"
	tftpv3 "github.com/pin/tftp/v3"
	"io"
	"os"
	"testing"
)

func TestTFTP(t *testing.T) {
	serverAddr := "127.0.0.1:3000"
	fileName := "testfile"
	fileContent := "hello"

	os.Create(fileName)
	os.WriteFile(fileName, []byte(fileContent), 0644)

	// Server setup
	readerFunc := func(filename string, rf io.ReaderFrom) error {
		file, err := os.OpenFile(fileName, os.O_RDONLY, 0644)
		if err != nil {
			return err
		}
		defer file.Close()
		_, err = rf.ReadFrom(file)
		return err
	}

	writerFunc := func(filename string, wt io.WriterTo) error {
		file, err := os.OpenFile(fileName, os.O_CREATE|os.O_WRONLY, 0644)
		if err != nil {
			return err
		}
		defer file.Close()
		_, err = wt.WriteTo(file)
		return err
	}

	server := tftpv3.NewServer(readerFunc, writerFunc)

	go func() {
		err := server.ListenAndServe(serverAddr)
		if err != nil {
			t.Fatalf("Server failed to listen: %v", err)
		}
	}()

	println("Server listening on", serverAddr)

	// Initialize TFTP client
	client, err := tftp.NewClient(serverAddr)
	if err != nil {
		t.Fatalf("Failed to create TFTP client: %v", err)
	}
	println("Client connected to", serverAddr)

	// Open the file to upload
	file, err := os.OpenFile(fileName, os.O_RDONLY, 0644)

	// Write to the server
	n, err := client.WriteFile(fileName, tftp.BinaryMode, io.Reader(file))
	if err != nil {
		t.Fatalf("Failed to write to server: %v", err)
	}
	println("Uploaded", n, "bytes")

	file.Close()

	// Read from the server
	file, _ = os.OpenFile(fileName, os.O_WRONLY, 0644)
	n, err = client.ReadFile(fileName, tftp.BinaryMode, io.Writer(file))
	if err != nil {
		t.Fatalf("Failed to read from server: %v", err)
	}
	println("Downloaded", n, "bytes")

	file.Close()

	// Validate the downloaded data matches what was uploaded
	buffer := make([]byte, len(fileContent))
	file, _ = os.OpenFile(fileName, os.O_RDONLY, 0644)
	io.ReadFull(file, buffer)
	if string(buffer) != fileContent {
		t.Errorf("Downloaded content mismatch. Expected: %s, Got: %s", fileContent, string(buffer))
	}
	println("Downloaded content matches the uploaded content")

	os.Remove(fileName)
}
