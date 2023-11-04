package observable

type NoReplayObservable[T any] struct {
	observers map[string]Observer[T]
}

func NewNoReplayObservable[T any]() NoReplayObservable[T] {
	return NoReplayObservable[T]{
		observers: make(map[string]Observer[T], 0),
	}
}

func (o *NoReplayObservable[T]) Next(value T) {
	o.broadcast(value)
}

func (o *NoReplayObservable[T]) Subscribe(observer Observer[T]) {
	o.observers[observer.Id()] = observer
}

func (o *NoReplayObservable[T]) Unsubscribe(id string) {
	delete(o.observers, id)
}

func (o *NoReplayObservable[T]) broadcast(value T) {
	for _, observer := range o.observers {
		observer.Next(value)
	}
}
