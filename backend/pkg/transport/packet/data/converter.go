package data

type valueConverter func(Value) Value
type valueReverter func(Value) Value

type ConversionDescriptor []Operation

type Operation struct {
	Operator string
	Operand  float64
}

func newConvertNumeric[N numeric](podConversion, displayConversion ConversionDescriptor) valueConverter {
	return func(value Value) Value {
		numeric := value.(NumericValue[N])
		for _, operation := range append(podConversion, displayConversion...) {
			switch operation.Operator {
			case "+":
				numeric.inner += N(operation.Operand)
			case "-":
				numeric.inner -= N(operation.Operand)
			case "*":
				numeric.inner *= N(operation.Operand)
			case "/":
				numeric.inner /= N(operation.Operand)
			}
		}
		return numeric
	}
}

func newRevertNumeric[N numeric](podConversion, displayConversion ConversionDescriptor) valueReverter {
	return func(value Value) Value {
		numeric := value.(NumericValue[N])
		for i := len(displayConversion) - 1; i >= 0; i-- {
			operation := displayConversion[i]
			switch operation.Operator {
			case "+":
				numeric.inner -= N(operation.Operand)
			case "-":
				numeric.inner += N(operation.Operand)
			case "*":
				numeric.inner /= N(operation.Operand)
			case "/":
				numeric.inner *= N(operation.Operand)
			}
		}

		for i := len(podConversion) - 1; i >= 0; i-- {
			operation := podConversion[i]
			switch operation.Operator {
			case "+":
				numeric.inner -= N(operation.Operand)
			case "-":
				numeric.inner += N(operation.Operand)
			case "*":
				numeric.inner /= N(operation.Operand)
			case "/":
				numeric.inner *= N(operation.Operand)
			}
		}

		return numeric
	}
}

func convertBoolean(value Value) Value {
	return value
}

func revertBoolean(value Value) Value {
	return value
}

func convertEnum(value Value) Value {
	return value
}

func revertEnum(value Value) Value {
	return value
}
