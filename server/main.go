package main

import (
	"net/http"
	"strings"

	"neko03.com/www/handlers"
	"neko03.com/www/server"
)

func main() {
    hosts := []string{"www.neko03.com"}

    var mux = handlers.NewMux()
    mux.Hosts = append(hosts, "localhost:8088")
    mux.RegisterFavicon(handlers.Favicon())
    mux.RegisterFileServer("/assets/", "./assets", handlers.SetHeaderGZ)
    mux.RegisterFileServer("/prototype2/", "./prototype2", func(w http.ResponseWriter, r *http.Request) {
        handlers.SetHeaderGZ(w, r)
        if strings.HasSuffix(r.URL.Path, "wasm.gz") {
            w.Header().Set("Content-Type", "application/wasm")
        }
    })
    mux.RegisterHandleFunc("/", handlers.JSPage("index", nil), nil)
    mux.RegisterHandleFunc("/jigokutsuushin", handlers.JSPage("jigokutsuushin", nil), nil)
    mux.RegisterHandleFunc("/nacho", handlers.Nacho(), nil)

    var ser = server.NewServers(mux.GetHandler())
    ser.RegisterHostWhiteList(hosts...)

    server.Start(ser)
}
