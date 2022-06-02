package main

import (
	"log"
	"net/http"
	"os"

	"neko03.com/www/handlers"
	"neko03.com/www/server"
)

var Logger = server.Logger
var debugger = log.New(os.Stderr, "[neko03.www/server]", log.LstdFlags|log.LUTC|log.Lshortfile)

func main() {
    hosts := []string{"www.neko03.com"}

    var mux = http.NewServeMux()
    handlers.RegisterFavicon(mux, "./assets/chiyoi/icon.png")
    handlers.RegisterFileServer(mux, "/assets/", "./assets")

    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        http.Redirect(w, r, "/chiyoi", http.StatusPermanentRedirect)
    })
    mux.HandleFunc("/chiyoi/twitter", func(w http.ResponseWriter, r *http.Request) {
        http.Redirect(w, r, "https://twitter.com/chiyoi2140", http.StatusPermanentRedirect)
    })

    mux.HandleFunc("/chiyoi", handlers.Chiyoi())
    mux.HandleFunc("/jigokutsuushin", handlers.JSPage("jigokutsuushin", nil))
    mux.HandleFunc("/shigure", handlers.JSPage("shigure", nil))
    mux.HandleFunc("/nacho", handlers.Nacho())
    mux.HandleFunc("/upload", handlers.UploadFile("./assets/tmp"))

    var ser = server.NewServers(mux)
    ser.RegisterHostWhiteList(hosts...)

    server.Start(ser)
}
