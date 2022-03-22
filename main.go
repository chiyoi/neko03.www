package main

import (
	"log"
    "github.com/kataras/iris/v12"

	"neko03.com/www/handlers"
)

func main() {
    app := iris.New()
    app.Get("/", handlers.IndexHandler)
    err := app.Run(iris.AutoTLS(":443", "", "syume1237@gmail.com"))
    log.Fatal(err)
}
