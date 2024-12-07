package pod_data

import (
	"fmt"
	"strings"

	"github.com/HyperloopUPV-H8/h9-backend/internal/adj"
	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/HyperloopUPV-H8/h9-backend/internal/utils"
)

const EnumType = "enum"

func getMeasurements(boardMeasurements []adj.Measurement, globalUnits map[string]utils.Operations) ([]Measurement, error) {
	measurements := make([]Measurement, 0)
	mErrors := common.NewErrorList()

	// TESTING
	println("I'm here")
	for _, adjMeas := range boardMeasurements {
		println(adjMeas.Id) // TESTING
	}

	for _, adjMeas := range boardMeasurements {
		meas, err := getMeasurement(adjMeas, globalUnits)

		if err != nil {
			mErrors.Add(err)
			continue
		}

		measurements = append(measurements, meas)
	}

	if len(mErrors) > 0 {
		return nil, mErrors
	}

	return measurements, nil
}

func getMeasurement(adeMeas adj.Measurement, globalUnits map[string]utils.Operations) (Measurement, error) {
	println(adeMeas.Id) // TESTING
	if isNumeric(adeMeas.Type) {
		return getNumericMeasurement(adeMeas, globalUnits)
	} else if adeMeas.Type == "bool" {
		return getBooleanMeasurement(adeMeas), nil
	} else if strings.HasPrefix(adeMeas.Type, "enum") {
		return getEnumMeasurement(adeMeas), nil
	} else {
		return nil, fmt.Errorf("type %s not recognized", adeMeas.Type)
	}
}

func getNumericMeasurement(adeMeas adj.Measurement, globalUnits map[string]utils.Operations) (NumericMeasurement, error) {
	measErrs := common.NewErrorList()

	safeRange := adeMeas.SafeRange

	warningRange := adeMeas.WarningRange

	displayUnits, err := utils.ParseUnits(adeMeas.DisplayUnits, globalUnits)

	if err != nil {
		measErrs.Add(err)
	}

	podUnits, err := utils.ParseUnits(adeMeas.PodUnits, globalUnits)

	if err != nil {
		measErrs.Add(err)
	}

	if len(measErrs) > 0 {
		return NumericMeasurement{}, measErrs
	}

	return NumericMeasurement{
		Id:           adeMeas.Id,
		Name:         adeMeas.Name,
		Type:         adeMeas.Type,
		Units:        displayUnits.Name,
		DisplayUnits: displayUnits,
		PodUnits:     podUnits,
		SafeRange:    safeRange,
		WarningRange: warningRange,
	}, nil
}

func getEnumMeasurement(adeMeas adj.Measurement) EnumMeasurement {
	return EnumMeasurement{
		Id:      adeMeas.Id,
		Name:    adeMeas.Name,
		Type:    EnumType,
		Options: getEnumMembers(adeMeas.Type),
	}
}

func getEnumMembers(enumExp string) []string {
	trimmedEnumExp := strings.Replace(enumExp, " ", "", -1)
	firstParenthesisIndex := strings.Index(trimmedEnumExp, "(")
	lastParenthesisIndex := strings.LastIndex(trimmedEnumExp, ")")

	return strings.Split(trimmedEnumExp[firstParenthesisIndex+1:lastParenthesisIndex], ",")
}

func getBooleanMeasurement(adeMeas adj.Measurement) BooleanMeasurement {
	return BooleanMeasurement{
		Id:   adeMeas.Id,
		Name: adeMeas.Name,
		Type: adeMeas.Type,
	}
}

func isNumeric(kind string) bool {
	return kind == "uint8" ||
		kind == "uint16" ||
		kind == "uint32" ||
		kind == "uint64" ||
		kind == "int8" ||
		kind == "int16" ||
		kind == "int32" ||
		kind == "int64" ||
		kind == "float32" ||
		kind == "float64"
}
