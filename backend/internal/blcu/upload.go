package blcu

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"time"

	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/HyperloopUPV-H8/h9-backend/internal/vehicle/models"
	wsModels "github.com/HyperloopUPV-H8/h9-backend/internal/ws_handle/models"
	"github.com/pin/tftp/v3"
)

type uploadRequest struct {
	Board string `json:"board"`
	File  string `json:"file"`
}

func (blcu *BLCU) upload(client wsModels.Client, payload json.RawMessage) error {
	blcu.trace.Debug().Msg("Handling upload")

	var request uploadRequest
	if err := json.Unmarshal(payload, &request); err != nil {
		blcu.trace.Error().Err(err).Stack().Msg("Unmarshal payload")
		return err
	}

	blcu.notifyUploadProgress(client, 0)

	if err := blcu.requestUpload(request.Board); err != nil {
		blcu.trace.Error().Err(err).Stack().Msg("Request upload")
		return err
	}

	decoded, err := base64.StdEncoding.DecodeString(request.File)
	if err != nil {
		blcu.trace.Error().Err(err).Stack().Msg("Decode payload")
		return err
	}

	reader := bytes.NewReader(decoded)
	return blcu.WriteTFTP(reader, int(reader.Size()), func(progress float64) {
		blcu.notifyUploadProgress(client, progress)
	})
}

func (blcu *BLCU) requestUpload(board string) error {
	blcu.trace.Info().Str("board", board).Msg("Requesting upload")

	uploadOrder, err := blcu.createUploadOrder(board)

	if err != nil {
		return err
	}
	if err := blcu.sendOrder(uploadOrder); err != nil {
		return err
	}

	// TODO: remove hardcoded timeout
	if _, err := common.ReadTimeout(blcu.ackChannel, time.Second*10); err != nil {
		return err
	}

	return nil
}

func (blcu *BLCU) createUploadOrder(board string) (models.Order, error) {
	boardId, ok := blcu.boardToId[board]

	if !ok {
		blcu.trace.Error().Str("board", board).Msg("board id not found")
		return models.Order{}, fmt.Errorf("missing id for board %s", board)
	}

	return models.Order{
		ID: blcu.config.Packets.Upload.Id,
		Fields: map[string]models.Field{
			blcu.config.Packets.Upload.Field: {
				Value:     boardId,
				IsEnabled: true,
			},
		},
	}, nil
}

func (blcu *BLCU) WriteTFTP(reader io.Reader, size int, onProgress func(float64)) error {
	blcu.trace.Info().Msg("Writing TFTP")

	client, err := tftp.NewClient(blcu.addr.String())
	if err != nil {
		blcu.trace.Error().Err(err).Str("client", blcu.addr.String()).Msg("creating client")
		return err
	}

	sender, err := client.Send("a.bin", "octet")
	if err != nil {
		blcu.trace.Error().Err(err).Msg("sending to client")
		return err
	}

	upload := NewUpload(reader, size, onProgress)
	_, err = sender.ReadFrom(&upload)

	return err
}

type uploadResponse struct {
	Percentage float64 `json:"percentage"`
	Failure    bool    `json:"failure"`
}

func (blcu *BLCU) notifyUploadFailure(client wsModels.Client) {
	blcu.trace.Warn().Msg("Upload failed")

	msgBuf, err := wsModels.NewMessageBuf(blcu.config.Topics.Upload, uploadResponse{Percentage: 0, Failure: true})

	if err != nil {
		return
	}

	err = client.Write(msgBuf)
	//TODO: handle error
	if err != nil {
		return
	}
}

func (blcu *BLCU) notifyUploadSuccess(client wsModels.Client) {
	blcu.trace.Info().Msg("Upload success")

	msgBuf, err := wsModels.NewMessageBuf(blcu.config.Topics.Upload, uploadResponse{Percentage: 100, Failure: false})

	if err != nil {
		return
	}

	err = client.Write(msgBuf)
	//TODO: handle error
	if err != nil {
		return
	}
}

func (blcu *BLCU) notifyUploadProgress(client wsModels.Client, percentage float64) {
	msgBuf, err := wsModels.NewMessageBuf(blcu.config.Topics.Upload, uploadResponse{Percentage: percentage, Failure: false})

	if err != nil {
		blcu.trace.Error().Err(err).Msg("creating upload progress message buf")
		return
	}

	err = client.Write(msgBuf)

	//TODO: handle error
	if err != nil {
		blcu.trace.Error().Err(err).Msg("notifying upload progress")
		return
	}
}

type Upload struct {
	reader     io.Reader
	onProgress func(float64)
	total      int
	current    int
}

func NewUpload(reader io.Reader, size int, onProgress func(float64)) Upload {
	return Upload{
		reader:     reader,
		onProgress: onProgress,
		total:      size,
		current:    0,
	}
}

func (upload *Upload) Read(p []byte) (n int, err error) {
	n, err = upload.reader.Read(p)
	if err == nil || errors.Is(err, io.EOF) {
		upload.current += n
		upload.onProgress(float64(upload.current) * 100 / float64(upload.total))
	}
	return n, err
}
