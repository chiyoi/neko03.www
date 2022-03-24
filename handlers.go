package main

import "github.com/kataras/iris/v12"


func index(c iris.Context) {
    c.View("index.html")
}
