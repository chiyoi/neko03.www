package main

import (
	"log"
	"net/http"

	"neko03.com/www/handlers"
)

func main() {
    http.HandleFunc("/", handlers.IndexHandler)
    log.Fatal(http.ListenAndServe(":80", nil))
}
