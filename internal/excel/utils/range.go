package utils

import (
	"errors"
	"strconv"
	"strings"
)

func ParseRange(literal string) ([]*float64, error) {
	if literal == "" {
		return []*float64{nil, nil}, nil
	}

	strRange := strings.Split(strings.TrimSuffix(strings.TrimPrefix(strings.Replace(literal, " ", "", -1), "["), "]"), ",")

	if len(strRange) != 2 {
		return nil, errors.New("invalid range")
	}

	numRange := make([]*float64, 0)

	if strRange[0] != "" {
		lowerBound, errLowerBound := strconv.ParseFloat(strRange[0], 64)

		if errLowerBound != nil {
			return nil, errors.New("parsing lower bound")
		}

		numRange = append(numRange, &lowerBound)
	} else {
		numRange = append(numRange, nil)
	}

	if strRange[1] != "" {
		upperBound, errUpperBound := strconv.ParseFloat(strRange[1], 64)

		if errUpperBound != nil {
			return nil, errors.New("parsing upper bound")
		}

		numRange = append(numRange, &upperBound)
	} else {
		numRange = append(numRange, nil)
	}

	return numRange, nil
}
