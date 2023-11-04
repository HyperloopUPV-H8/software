package observable

import "sync"

type ReplayObservable[T any] struct {
	last   T
	lastMx *sync.Mutex

	observers  map[string]Observer[T]
	observerMx *sync.Mutex
}

func NewReplayObservable[T any](initialValue T) ReplayObservable[T] {
	return ReplayObservable[T]{
		last:   initialValue,
		lastMx: &sync.Mutex{},

		observers:  make(map[string]Observer[T], 0),
		observerMx: &sync.Mutex{},
	}
}

func (o *ReplayObservable[T]) Next(value T) {
	o.lastMx.Lock()
	defer o.lastMx.Unlock()
	o.last = value

	o.broadcast(value)
}

func (o *ReplayObservable[T]) Subscribe(observer Observer[T]) {
	o.observerMx.Lock()
	defer o.observerMx.Unlock()
	o.observers[observer.Id()] = observer

	o.lastMx.Lock()
	defer o.lastMx.Unlock()
	observer.Next(o.last)
}

func (o *ReplayObservable[T]) Unsubscribe(id string) {
	delete(o.observers, id)
}

func (o *ReplayObservable[T]) broadcast(value T) {
	o.observerMx.Lock()
	defer o.observerMx.Unlock()
	for _, observer := range o.observers {
		observer.Next(value)
	}
}
