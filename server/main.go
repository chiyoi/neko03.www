package main

import (
	"neko03.com/www/handlers"
	"neko03.com/www/server"
)

func main() {
    var mux = handlers.Mux()
    mux.RegisterFileServer("/assets/", "./assets")
    mux.RegisterFavicon(handlers.Favicon())
    for k, v := range map[string]string{
        "/": "index",
        "/jigokutsuushin": "jigokutsuushin",
    } {
        mux.RegisterHandleFunc(k, handlers.JSPage(v))
    }
    var ser = server.Servers(mux.GetHandler())
    ser.RegisterHostWhiteList("www.neko03.com")
    server.Start(ser)
}
