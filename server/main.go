package main

import (
    "neko03.com/www/handlers"
    "neko03.com/www/server"
    "net/http"
)

func main() {
    hosts := []string{"www.neko03.com"}

    var mux = http.NewServeMux()

    handlers.RegisterFileServer(mux, "/disk/", "./disk")
    handlers.RegisterFileServer(mux, "/git/", "./git")
    handlers.RegisterFileServer(mux, "/assets/", "./assets")

    handlers.RegisterFavicon(mux, "./assets/chiyoi/icon.png")

    handlers.RegisterHandler(mux, "/", func(w http.ResponseWriter, r *http.Request) {
        http.Redirect(w, r, "/chiyoi", http.StatusPermanentRedirect)
    })
    handlers.RegisterHandler(mux, "/chiyoi/twitter", func(w http.ResponseWriter, r *http.Request) {
        http.Redirect(w, r, "https://twitter.com/chiyoi2140", http.StatusPermanentRedirect)
    })

    handlers.RegisterHandler(mux, "/chiyoi", handlers.Chiyoi())
    handlers.RegisterHandler(mux, "/jigokutsuushin", handlers.JSPage("jigokutsuushin", nil))
    handlers.RegisterHandler(mux, "/shigure", handlers.JSPage("shigure", nil))
    handlers.RegisterHandler(mux, "/nacho", handlers.Nacho())
    handlers.RegisterHandler(mux, "/upload", handlers.UploadFile("./disk"))

    var ser = server.NewServers(mux)
    ser.RegisterHostWhiteList(hosts...)

    server.Start(ser)
}
