package main

import (
	"neko03.com/www/handlers"
	"neko03.com/www/server"
)

func main() {
    hosts := []string{"www.neko03.com"}

    var mux = handlers.NewMux()
    mux.Hosts = append(hosts, "localhost:8088")
    mux.RegisterFileServer("/assets/", "./assets")
    mux.RegisterFileServer("/prototype2/", "./prototype2")
    mux.RegisterFavicon(handlers.Favicon())
    for k, v := range map[string]string{
        "/": "index",
        "/jigokutsuushin": "jigokutsuushin",
    } {
        mux.RegisterHandleFunc(k, handlers.JSPage(v, nil))
    }
    mux.RegisterHandleFunc("/nacho", handlers.Nacho())

    var ser = server.NewServers(mux.GetHandler())
    ser.RegisterHostWhiteList(hosts...)

    server.Start(ser)
}
