package handlers

import (
	"github.com/kataras/iris/v12"
)

func IndexHandler(c iris.Context) {
    c.View("index.html")
}
