package abstraction

// LoggerName is the name of the logger that manages a piece of data
type LoggerName string

// LoggerRecord is a piece of data stored by a logger
type LoggerRecord interface {
	Name() LoggerName
}

// LoggerRequest is a request made to a logger for a piece of data
type LoggerRequest interface {
	Name() LoggerName
}

// Logger is the module in charge of storing and retrieving information from the
// hard drive, making it persistent.
type Logger interface {
	Start(startKeys map[LoggerName]Logger) error
	Stop(stopKeys map[LoggerName]Logger) error
	// PushRecord will store a record to disk
	PushRecord(LoggerRecord) error
	// PullRecord will retrieve a record from disk
	PullRecord(LoggerRequest) (LoggerRecord, error)
}
