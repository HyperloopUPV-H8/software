package main

import (
	"os"
	"strconv"

	"github.com/rs/zerolog"
	trace "github.com/rs/zerolog/log"
	"github.com/rs/zerolog/pkgerrors"
)

var traceLevelMap = map[string]zerolog.Level{
	"fatal":    zerolog.FatalLevel,
	"error":    zerolog.ErrorLevel,
	"warn":     zerolog.WarnLevel,
	"info":     zerolog.InfoLevel,
	"debug":    zerolog.DebugLevel,
	"trace":    zerolog.TraceLevel,
	"disabled": zerolog.Disabled,
}

func initTrace(traceLevel string, traceFile string) *os.File {
	zerolog.CallerMarshalFunc = func(pc uintptr, file string, line int) string {
		return file + ":" + strconv.Itoa(line)
	}
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnixNano
	zerolog.ErrorStackMarshaler = pkgerrors.MarshalStack

	consoleWriter := zerolog.ConsoleWriter{Out: os.Stdout}

	file, err := os.Create(traceFile)
	if err != nil {
		trace.Logger = trace.Logger.Output(consoleWriter)
		trace.Fatal().Stack().Err(err).Msg("")
		return nil
	}

	multi := zerolog.MultiLevelWriter(consoleWriter, file)

	trace.Logger = zerolog.New(multi).With().Timestamp().Caller().Logger()

	if level, ok := traceLevelMap[traceLevel]; ok {
		zerolog.SetGlobalLevel(level)
	} else {
		trace.Fatal().Msg("invalid log level selected")
		file.Close()
		return nil
	}

	return file
}
