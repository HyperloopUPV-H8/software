package http

import "net/http"

func NewServer(mux *http.ServeMux) *http.Server {
	return &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}
}
