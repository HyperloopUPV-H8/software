package blcu

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/HyperloopUPV-H8/h9-backend/internal/vehicle/models"
	wsModels "github.com/HyperloopUPV-H8/h9-backend/internal/ws_handle/models"
	"github.com/pin/tftp/v3"
)

type downloadRequest struct {
	Board string `json:"board"`
}

func (blcu *BLCU) download(client wsModels.Client, payload json.RawMessage) (string, []byte, error) {
	blcu.trace.Debug().Msg("Handling download")
	var request downloadRequest
	if err := json.Unmarshal(payload, &request); err != nil {
		blcu.trace.Error().Err(err).Stack().Msg("Unmarshal payload")
		return "", nil, err
	}

	blcu.notifyDownloadProgress(client, 0)

	if err := blcu.requestDownload(request.Board); err != nil {
		blcu.trace.Error().Err(err).Stack().Msg("Request download")
		return request.Board, nil, err
	}

	buffer := &bytes.Buffer{}
	err := blcu.ReadTFTP(buffer, func(percentage float64) { blcu.notifyDownloadProgress(client, percentage) })

	return request.Board, buffer.Bytes(), err
}

func (blcu *BLCU) requestDownload(board string) error {
	blcu.trace.Info().Str("board", board).Msg("Requesting download")

	downloadOrder, err := blcu.createDownloadOrder(board)

	if err != nil {
		return err
	}

	if err := blcu.sendOrder(downloadOrder); err != nil {
		return err
	}

	// TODO: remove hardcoded timeout
	if _, err := common.ReadTimeout(blcu.ackChannel, time.Second*10); err != nil {
		return err
	}

	return nil
}

func (blcu *BLCU) createDownloadOrder(board string) (models.Order, error) {
	boardId, ok := blcu.boardToId[board]

	if !ok {
		blcu.trace.Error().Str("board", board).Msg("board id not found")
		return models.Order{}, fmt.Errorf("missing id for board %s", board)
	}

	return models.Order{
		ID: blcu.config.Packets.Download.Id,
		Fields: map[string]models.Field{
			blcu.config.Packets.Download.Field: {
				Value:     boardId,
				IsEnabled: true,
			},
		},
	}, nil
}

const FlashMemorySize = 786432

func (blcu *BLCU) ReadTFTP(output io.Writer, onProgress func(float64)) error {
	blcu.trace.Info().Msg("Reading TFTP")

	client, err := tftp.NewClient(blcu.addr.String())
	if err != nil {
		return err
	}

	receiver, err := client.Receive("a.bin", "octet")
	if err != nil {
		return err
	}

	download := NewDownload(output, FlashMemorySize, onProgress)
	_, err = receiver.WriteTo(&download)

	return err
}

type downloadResponse struct {
	Percentage float64 `json:"percentage"`
	IsFailure  bool    `json:"failure"`
	File       []byte  `json:"file,omitempty"`
}

func (blcu *BLCU) notifyDownloadFailure(client wsModels.Client) {
	blcu.trace.Warn().Msg("Download failed")

	msgBuf, err := wsModels.NewMessageBuf(blcu.config.Topics.Download, downloadResponse{IsFailure: true, File: nil, Percentage: 0.0})

	//TODO: handle errors
	if err != nil {
		return
	}

	err = client.Write(msgBuf)

	if err != nil {
		return
	}
}

func (blcu *BLCU) notifyDownloadSuccess(client wsModels.Client, data []byte) {
	blcu.trace.Info().Msg("Download success")

	msgBuf, err := wsModels.NewMessageBuf(blcu.config.Topics.Download, downloadResponse{IsFailure: false, File: data, Percentage: 100})

	//TODO: handle errors
	if err != nil {
		return
	}

	err = client.Write(msgBuf)

	if err != nil {
		return
	}
}

func (blcu *BLCU) notifyDownloadProgress(client wsModels.Client, percentage float64) {
	msgBuf, err := wsModels.NewMessageBuf(blcu.config.Topics.Download, downloadResponse{IsFailure: false, File: nil, Percentage: percentage})

	//TODO: handle errors
	if err != nil {
		return
	}

	err = client.Write(msgBuf)

	if err != nil {
		return
	}
}

func (blcu *BLCU) writeDownloadFile(board string, data []byte) error {
	blcu.trace.Info().Msg("Creating download file")

	err := os.MkdirAll(blcu.config.DownloadPath, 0777)
	if err != nil {
		return err
	}
	err = os.Chmod(blcu.config.DownloadPath, 0777)
	if err != nil {
		return err
	}

	return os.WriteFile(path.Join(blcu.config.DownloadPath, fmt.Sprintf("%s-%d.bin", board, time.Now().Unix())), data, 0777)
}

type Download struct {
	writer     io.Writer
	onProgress func(float64)
	total      int
	current    int
}

func NewDownload(writer io.Writer, size int, onProgress func(float64)) Download {
	return Download{
		writer:     writer,
		onProgress: onProgress,
		total:      size,
		current:    0,
	}
}

func (download *Download) Write(p []byte) (n int, err error) {
	n, err = download.writer.Write(p)
	if err == nil {
		download.current += n
		download.onProgress(float64(download.current) * 100 / float64(download.total))
	}
	return n, err
}
