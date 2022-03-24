package main

import (
	"log"

	"github.com/kataras/iris/v12"
)

var app = iris.New()
var templates = iris.HTML("./templates", ".html")

func init() {
    templates.Reload(true)
    app.RegisterView(templates)
}

func main() {
    app.Get("/", index)
    //app.Favicon("./assets/favicon.ico")

    err := app.Listen(":80")
    log.Fatal(err)
}
