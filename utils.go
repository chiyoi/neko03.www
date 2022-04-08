package main

import (
	"log"
	"net/http"
	"strings"
)

func Must[T any](value T, err error) T {
	if err != nil {log.Fatal(err)}
	return value
}

func Assert(err error) {
	if err != nil {log.Fatal(err)}
}

func PathConstrain(path string, w http.ResponseWriter, r *http.Request) bool {
    if ! (strings.HasPrefix(r.Host, "www") || strings.HasPrefix(r.Host, "localhost")) || r.URL.Path != path {
		http.NotFound(w, r)
		return false
	}
	return true
}
