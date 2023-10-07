package abstraction

type LoggerName string

type LoggerRecord interface {
	Name() LoggerName
}

type LoggerRequest interface {
	Name() LoggerName
}

type Logger interface {
	PushRecord(LoggerRecord) error
	PullRecord(LoggerRequest) (LoggerRecord, error)
}
