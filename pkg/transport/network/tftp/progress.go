package tftp

import "io"

type progressCallback = func(file string, amount int)

type fileProgress struct {
	file     string
	callback progressCallback
}

type progressReader struct {
	fileProgress
	reader io.Reader
}

func newProgressReader(file string, callback progressCallback, reader io.Reader) progressReader {
	return progressReader{
		fileProgress: fileProgress{
			file:     file,
			callback: callback,
		},
		reader: reader,
	}
}

func (progress progressReader) Read(p []byte) (n int, err error) {
	n, err = progress.reader.Read(p)
	progress.callback(progress.file, n)
	return
}

type progressWriter struct {
	fileProgress
	writer io.Writer
}

func newProgressWriter(file string, callback progressCallback, writer io.Writer) progressWriter {
	return progressWriter{
		fileProgress: fileProgress{
			file:     file,
			callback: callback,
		},
		writer: writer,
	}
}

func (progress progressWriter) Write(p []byte) (n int, err error) {
	n, err = progress.writer.Write(p)
	progress.callback(progress.file, n)
	return
}
