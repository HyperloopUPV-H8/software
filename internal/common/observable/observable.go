package observable

type Observer[T any] interface {
	Id() string
	Next(value T)
}

type Observable[T any] interface {
	Next(v T)
	Subscribe(observer Observer[T])
	Unsubscribe(id string)
}
