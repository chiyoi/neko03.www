package main

import (
    "context"
    "log"
    "neko03.www.server/handlers"
    "neko03.www.server/handlers/nacho"
    "neko03.www.server/server"
    "net/http"
    "os"
    "os/signal"
    "time"
)

var isDevelop bool

var logger = log.New(os.Stdout, "[neko03] ", log.LstdFlags|log.LUTC)
var debugger = log.New(os.Stderr, "[neko03] ", log.LstdFlags|log.LUTC|log.Lshortfile)

var hosts []string
var mux *http.ServeMux
var httpServer, httpsServer *http.Server

func init() {
    isDevelop = os.Getenv("TERM_PROGRAM") == "Apple_Terminal" ||
        os.Getenv("TERMINAL_EMULATOR") == "JetBrains-JediTerm"

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
    if isDevelop {
        go dev()
    } else {
        go prod()
    }

    var sig = make(chan os.Signal)
    signal.Notify(sig, os.Interrupt)

    interrupt := <-sig
    logger.Println(interrupt)

    if isDevelop {
        stop(httpServer)
    } else {
        stop(httpsServer)
        stop(httpServer)
    }
}

func dev() {
    httpServer.Addr = ":8088"
    logger.Println("serving :8088")
    if err := httpServer.ListenAndServe(); err != http.ErrServerClosed {
        debugger.Println("dev/httpServer.ListenAndServe:", err)
    }
}

func prod() {
    go func() {
        logger.Println("serving http.")
        if err := httpServer.ListenAndServe(); err != http.ErrServerClosed {
            debugger.Println("prod/httpServer.ListenAndServe:", err)
        }
    }()

    logger.Println("serving https.")
    if err := httpsServer.ListenAndServeTLS("", ""); err != http.ErrServerClosed {
        debugger.Println("prod/httpsServer.ListenAndServeTLS:", err)
    }
}

func stop(ser *http.Server) {
    var timer, cancel = context.WithTimeout(context.Background(), time.Second*5)
    defer cancel()
    if err := ser.Shutdown(timer); err != nil {
        debugger.Println("stop/ser.Shutdown:", err)
    }
}
