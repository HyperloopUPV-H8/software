package logger_handler

type Config struct {
	Topics        LoggerTopics `toml:"topics"`
	BasePath      string       `toml:"base_path"`
	FlushInterval string       `toml:"flush_interval"`
}

type LoggerTopics struct {
	Enable string `toml:"enable"`
}
