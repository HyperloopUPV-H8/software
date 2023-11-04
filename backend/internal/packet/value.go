package packet

type Value interface {
	Inner() any
}

type Numeric float64

func (n Numeric) Inner() any {
	return float64(n)
}

type Boolean bool

func (b Boolean) Inner() any {
	return bool(b)
}

type Enum string

func (e Enum) Inner() any {
	return string(e)
}
