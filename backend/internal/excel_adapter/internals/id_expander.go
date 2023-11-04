package internals

import (
	"log"
	"regexp"
	"strconv"
)

func GetAllIds(id string) []string {
	if isNumber(id) {
		return []string{id}
	}

	prefix, begin, end := getIdParts(id)
	idRange := getIdRange(begin, end)
	finalIds := make([]string, len(idRange))
	for index, sufix := range idRange {
		finalIds[index] = prefix + sufix
	}
	return finalIds
}

var numberExp = regexp.MustCompile(`^\d+$`)

func isNumber(id string) bool {
	return numberExp.MatchString(id)
}

var expandExp = regexp.MustCompile(`^(\d*)\[(\d+),(\d+)\]$`)

func getIdParts(id string) (prefix string, begin string, end string) {
	matches := expandExp.FindStringSubmatch(id)
	return matches[1], matches[2], matches[3]
}

func getIdRange(begin string, end string) []string {
	lowerLimit := stringToInt(begin)
	upperLimit := stringToInt(end)
	numRange := getRange(lowerLimit, upperLimit)
	stringRange := rangeToString(numRange)
	return stringRange
}

func stringToInt(num string) int {
	n, err := strconv.ParseInt(num, 10, 32)

	if err != nil {
		log.Fatalf("parse: %s\n", err)
	}

	return int(n)
}

func getRange(n1 int, n2 int) []int {
	numRange := make([]int, n2-n1+1)
	for n := n1; n <= n2; n++ {
		index := n - n1
		numRange[index] = n
	}
	return numRange
}

func rangeToString(numRange []int) []string {
	rangeInString := make([]string, len(numRange))
	for index, num := range numRange {
		str := strconv.Itoa(num)
		rangeInString[index] = str
	}
	return rangeInString
}
