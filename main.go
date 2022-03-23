package main

import (
	"log"

	"neko03.com/www/handlers"
)

func main() {
    app.Get("/", handlers.IndexHandler)
    err := app.Listen("0.0.0.0:80")
    log.Fatal(err)
}
