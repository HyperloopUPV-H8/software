package tftp

import "io"

// progressCallback is a function called when progress reading or writing a file is made
type progressCallback = func(file string, amount int)

// fileProgress holds information on the file and callback assigned to it
type fileProgress struct {
	file     string
	callback progressCallback
}

// progressReader holds all the information to notify of progress when reading a file
type progressReader struct {
	fileProgress
	reader io.Reader
}

// newProgressReader creates a new progressReader with the provided parameters
func newProgressReader(file string, callback progressCallback, reader io.Reader) progressReader {
	return progressReader{
		fileProgress: fileProgress{
			file:     file,
			callback: callback,
		},
		reader: reader,
	}
}

// Read maps the unerlying reader Read method and calls the progress callback after reading
func (progress progressReader) Read(p []byte) (n int, err error) {
	n, err = progress.reader.Read(p)
	progress.callback(progress.file, n)
	return
}

// progressWriter holds all the information to notify of progress when writing a file
type progressWriter struct {
	fileProgress
	writer io.Writer
}

// newProgressWriter creates a new progressWriter with the provided parameters
func newProgressWriter(file string, callback progressCallback, writer io.Writer) progressWriter {
	return progressWriter{
		fileProgress: fileProgress{
			file:     file,
			callback: callback,
		},
		writer: writer,
	}
}

// Write maps the underlying writer Write method and calls the progress callback after writing
func (progress progressWriter) Write(p []byte) (n int, err error) {
	n, err = progress.writer.Write(p)
	progress.callback(progress.file, n)
	return
}
