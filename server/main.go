package main

import (
    "context"
    "net/http"
    "os"
    "os/signal"
    "time"

    "neko03/handlers"
    "neko03/handlers/nacho"
    "neko03/server"
    "neko03/utils"
)

var logger = utils.NewLogger(os.Stdout, "[neko03] ")
var debugger = utils.NewLogger(os.Stderr, "[neko03] ")

var hosts []string
var mux *http.ServeMux
var httpServer, httpsServer *http.Server

func init() {
    hosts = []string{"www.neko03.com"}

    mux = http.NewServeMux()
    registerHandlers()

    var certManager = server.NewCertManager(hosts)
    httpServer, httpsServer = server.NewServers(mux, certManager)
}
func registerHandlers() {
    mux.HandleFunc(handlers.FileServer("/disk", "./disk"))

    mux.HandleFunc(handlers.PathAssert("/", func(w http.ResponseWriter, r *http.Request) {
        http.Redirect(w, r, "/chiyoi", http.StatusPermanentRedirect)
    }))
    mux.HandleFunc(handlers.Favicon("./assets/chiyoi/icon.png"))
    mux.HandleFunc(handlers.PathAssert("/chiyoi/twitter", func(w http.ResponseWriter, r *http.Request) {
        http.Redirect(w, r, "https://twitter.com/chiyoi2140", http.StatusPermanentRedirect)
    }))

    mux.HandleFunc(handlers.JSPageWithAssets("chiyoi"))
    mux.HandleFunc(nacho.Nacho())
    mux.HandleFunc(handlers.JSPageWithAssets("jigokutsuushin"))
    mux.HandleFunc(handlers.JSPageWithAssets("shigure"))
    mux.HandleFunc(handlers.UploadFile("upload", "./disk"))
}

func main() {
    if os.Getenv("ENVIRONMENT") == "prod" {
        go prod()
    } else {
        go dev()
    }

    var sig = make(chan os.Signal)
    signal.Notify(sig, os.Interrupt)

    interrupt := <-sig
    logger.Println(interrupt)

    if os.Getenv("ENVIRONMENT") == "prod" {
        stop(httpsServer)
        stop(httpServer)
    } else {
        stop(httpServer)
    }
}

func dev() {
    httpServer.Addr = ":8088"
    logger.Println("serving :8088")
    if err := httpServer.ListenAndServe(); err != http.ErrServerClosed {
        debugger.Println("httpServer.ListenAndServe:", err)
    }
}

func prod() {
    go func() {
        logger.Println("serving http.")
        if err := httpServer.ListenAndServe(); err != http.ErrServerClosed {
            debugger.Println("httpServer.ListenAndServe:", err)
        }
    }()

    logger.Println("serving https.")
    if err := httpsServer.ListenAndServeTLS("", ""); err != http.ErrServerClosed {
        debugger.Println("httpsServer.ListenAndServeTLS:", err)
    }
}

func stop(ser *http.Server) {
    var timer, cancel = context.WithTimeout(context.Background(), time.Second*5)
    defer cancel()
    if err := ser.Shutdown(timer); err != nil {
        debugger.Println("ser.Shutdown:", err)
    }
}
