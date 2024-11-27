package internals

const SHEETS_MIME_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

type DownloadConfig struct {
	Id   string
	Path string
	Name string
}
