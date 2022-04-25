package utils

import (
	"log"
	"net/http"
)

func Must[T any](value T, err error) T {
	if err != nil {log.Fatal(err)}
	return value
}

func Assert(err error) {
	if err != nil {log.Fatal(err)}
}

func HostAssert(hosts []string, w http.ResponseWriter, r *http.Request) bool {
    for _, host := range hosts {
        if r.Host == host {
            return true
        }
    }
    http.NotFound(w, r)
    return false
}
func PathAssert(path string, w http.ResponseWriter, r *http.Request) bool {
    if r.URL.Path != path {
		http.NotFound(w, r)
		return false
	}
	return true
}
