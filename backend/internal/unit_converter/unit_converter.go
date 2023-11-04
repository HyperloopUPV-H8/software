package unit_converter

import (
	"fmt"

	"github.com/HyperloopUPV-H8/h9-backend/internal/excel/utils"
	"github.com/HyperloopUPV-H8/h9-backend/internal/pod_data"
	"github.com/rs/zerolog"
	trace "github.com/rs/zerolog/log"
)

type UnitConverter struct {
	operations map[string]utils.Operations
	trace      zerolog.Logger
}

func NewUnitConverter(kind string, boards []pod_data.Board, unitToOperations map[string]utils.Operations) UnitConverter {
	trace.Info().Str("kind", kind).Msg("new unit converter")

	operations := make(map[string]utils.Operations)

	for _, board := range boards {
		for _, packet := range board.Packets {
			for _, meas := range packet.Measurements {
				if numericMeas, ok := meas.(pod_data.NumericMeasurement); ok {
					if kind == "pod" {
						operations[numericMeas.Id] = numericMeas.PodUnits.Operations
					} else if kind == "display" {
						operations[numericMeas.Id] = numericMeas.DisplayUnits.Operations
					} else {
						continue
					}
				}
			}
		}
	}

	return UnitConverter{
		operations: operations,
		trace:      trace.With().Str("component", "unitConverter").Str("kind", kind).Logger(),
	}
}

func (converter *UnitConverter) Convert(name string, value float64) (float64, error) {
	ops, ok := converter.operations[name]
	if ok {
		converter.trace.Trace().Msg("convert")
		return ops.Convert(value), nil
	} else {
		converter.trace.Error().Str("name", name).Msg("operations not found")
		return 0, fmt.Errorf("couldn't find operations for %s", name)
	}
}

func (converter *UnitConverter) Revert(name string, value float64) (float64, error) {
	ops, ok := converter.operations[name]
	if ok {
		converter.trace.Trace().Msg("convert")

		return ops.Revert(value), nil
	} else {
		return 0, fmt.Errorf("couldn't find operations for %s", name)
	}
}
