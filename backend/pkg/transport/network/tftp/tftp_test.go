package tftp_test

import (
	"bytes"
	"github.com/HyperloopUPV-H8/h9-backend/pkg/transport/network/tftp"
	"testing"
)

func TestTFTPClientFileOperations(t *testing.T) {
	serverAddr := "127.0.0.1:50400"
	fileName := "testfile.txt"
	fileContent := "Hello, TFTP World!"

	// Initialize TFTP client with a mock progress callback
	client, err := tftp.NewClient(serverAddr,
		tftp.WithProgressCallback(func(file string, amount int) {
			t.Logf("Progress for %s: %d bytes", file, amount)
		}),
	)
	if err != nil {
		t.Fatalf("Failed to create TFTP client: %v", err)
	}

	// Mock a file reader for the upload test
	uploadContent := bytes.NewReader([]byte(fileContent))
	n, err := client.WriteFile(fileName, tftp.BinaryMode, uploadContent)
	if err != nil || n <= 0 {
		t.Errorf("Failed to upload file: %v, bytes: %d", err, n)
	}

	// Mock a buffer for the download test
	downloadBuffer := bytes.NewBuffer(nil)
	n, err = client.ReadFile(fileName, tftp.BinaryMode, downloadBuffer)
	if err != nil || n <= 0 {
		t.Errorf("Failed to download file: %v, bytes: %d", err, n)
	}

	// Validate the downloaded data matches what was uploaded
	if downloadBuffer.String() != fileContent {
		t.Errorf("Downloaded content mismatch. Expected: %s, Got: %s", fileContent, downloadBuffer.String())
	}
}
