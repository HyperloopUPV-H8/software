package abstraction

import "time"

type Sublogger interface {
	Log(timestamp time.Time, message string)
	Start()
	Stop()
}
