package main

import "github.com/kataras/iris/v12"

var app = iris.New()
var templates = iris.HTML("./handlers/html", ".html")

func init() {
    app.RegisterView(templates)
}
