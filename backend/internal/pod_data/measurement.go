package pod_data

import (
	"fmt"
	"strings"

	"github.com/HyperloopUPV-H8/h9-backend/internal/adj"
	"github.com/HyperloopUPV-H8/h9-backend/internal/common"
	"github.com/HyperloopUPV-H8/h9-backend/internal/utils"
)

const EnumType = "enum"

func getMeasurements(packet adj.Packet, globalUnits map[string]utils.Operations) ([]Measurement, error) {
	measurements := make([]Measurement, 0)
	mErrors := common.NewErrorList()

	for _, adjMeas := range packet.Variables {
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
	var tmp Measurement
	var err error
	if isNumeric(adeMeas.Type) {
		tmp, err = getNumericMeasurement(adeMeas, globalUnits)
	} else if adeMeas.Type == "bool" {
		tmp = getBooleanMeasurement(adeMeas)
	} else if strings.HasPrefix(adeMeas.Type, "enum") {
		tmp = getEnumMeasurement(adeMeas)
	} else {
		println("no valid type")
		return nil, fmt.Errorf("type %s not recognized", adeMeas.Type)
	}
	println("Generated Measurement is: ", tmp.GetName())
	return tmp, err
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
		Options: getEnumMembers(adeMeas.EnumValues),
	}
}

func getEnumMembers(enumExp []string) []string {
	return enumExp
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
