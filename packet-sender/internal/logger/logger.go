package logger

import (
	"fmt"
	"log"
	"os"
	"strings"
	"time"
)

type Level int

const (
	DebugLevel Level = iota
	InfoLevel
	WarnLevel
	ErrorLevel
)

type Logger interface {
	Debug(msg string, args ...interface{})
	Info(msg string, args ...interface{})
	Warn(msg string, args ...interface{})
	Error(msg string, args ...interface{})
}

type ConsoleLogger struct {
	level  Level
	logger *log.Logger
}

func NewLogger(levelStr string) Logger {
	level := parseLevel(levelStr)
	return &ConsoleLogger{
		level:  level,
		logger: log.New(os.Stdout, "", 0), // We'll handle our own formatting
	}
}

func parseLevel(levelStr string) Level {
	switch strings.ToLower(levelStr) {
	case "debug":
		return DebugLevel
	case "info":
		return InfoLevel
	case "warn", "warning":
		return WarnLevel
	case "error":
		return ErrorLevel
	default:
		return InfoLevel
	}
}

func (cl *ConsoleLogger) Debug(msg string, args ...interface{}) {
	if cl.level <= DebugLevel {
		cl.log("DEBUG", msg, args...)
	}
}

func (cl *ConsoleLogger) Info(msg string, args ...interface{}) {
	if cl.level <= InfoLevel {
		cl.log("INFO", msg, args...)
	}
}

func (cl *ConsoleLogger) Warn(msg string, args ...interface{}) {
	if cl.level <= WarnLevel {
		cl.log("WARN", msg, args...)
	}
}

func (cl *ConsoleLogger) Error(msg string, args ...interface{}) {
	if cl.level <= ErrorLevel {
		cl.log("ERROR", msg, args...)
	}
}

func (cl *ConsoleLogger) log(level, msg string, args ...interface{}) {
	timestamp := time.Now().Format("15:04:05")
	formattedMsg := fmt.Sprintf(msg, args...)
	
	var colorCode string
	switch level {
	case "DEBUG":
		colorCode = "\033[90m" // Dark gray
	case "INFO":
		colorCode = "\033[32m" // Green
	case "WARN":
		colorCode = "\033[33m" // Yellow
	case "ERROR":
		colorCode = "\033[31m" // Red
	}
	
	resetCode := "\033[0m"
	
	logLine := fmt.Sprintf("%s[%s]%s %s%5s%s %s", 
		colorCode, timestamp, resetCode,
		colorCode, level, resetCode,
		formattedMsg)
	
	cl.logger.Println(logLine)
}