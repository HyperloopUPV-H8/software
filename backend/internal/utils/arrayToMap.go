package utils

func ConvertToMap_Str_Uint16(array []map[string]uint16) map[string]uint16 {
	result := make(map[string]uint16)
	for _, item := range array {
		for k, v := range item {
			result[k] = v
		}
	}
	return result
}

func ConvertToMap_Str_Str(array []map[string]string) map[string]string {
	result := make(map[string]string)
	for _, item := range array {
		for k, v := range item {
			result[k] = v
		}
	}
	return result
}

func ConvertToMap_Str_Op(array []map[string]Operations) map[string]Operations {
	result := make(map[string]Operations)
	for _, item := range array {
		for k, v := range item {
			result[k] = v
		}
	}
	return result
}
