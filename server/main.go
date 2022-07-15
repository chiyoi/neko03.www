package main

import (
    "context"
    "net/http"
    "os"
    "os/signal"
    "path"
    "strings"
    "time"

    "neko03/handlers"
    "neko03/handlers/nacho"
    "neko03/server"
    "neko03/utils"
)

var (
    logger   = utils.NewLogger(os.Stdout, "[neko03] ")
    debugger = utils.NewLogger(os.Stderr, "[neko03] ")
)

var (
    hosts                   []string
    httpServer, httpsServer *http.Server
    pageMux, apiMux         *http.ServeMux
)

func init() {
    hosts = []string{"www.neko03.com"}

    apiMux = http.NewServeMux()
    apiMux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        if strings.ToLower(r.URL.Host) == "neko03.com" {
            r.URL.Scheme = "https"
            r.URL.Host = "www.neko03.com"
            http.Redirect(w, r, r.URL.String(), http.StatusPermanentRedirect)
            return
        }
        if r.URL.Path != "/" {
            http.NotFound(w, r)
            return
        }
        switch strings.ToLower(r.URL.Host) {
        case "twitter.neko03.com":
            http.Redirect(w, r, "https://twitter.com/chiyoi2140/", http.StatusPermanentRedirect)
        case "github.neko03.com":
            http.Redirect(w, r, "https://github.com/chiyoi/", http.StatusPermanentRedirect)
        case "chiyoi.neko03.com":
            http.Redirect(w, r, "https://www.neko03.com/chiyoi/", http.StatusPermanentRedirect)
        case "nacho.neko03.com":
            http.Redirect(w, r, "https://www.neko03.com/nacho/", http.StatusPermanentRedirect)
        default:
            http.NotFound(w, r)
        }
    })
    apiMux.HandleFunc("/gopkg/", func(w http.ResponseWriter, r *http.Request) {
        if strings.ToLower(r.URL.Host) != "neko03.com" {
            http.NotFound(w, r)
            return
        }
        r.URL.Scheme = "https"
        r.URL.Host = "github.com"
        r.URL.Path = path.Join("/chiyoi/", r.URL.Path)
        http.Redirect(w, r, r.URL.String(), http.StatusPermanentRedirect)
    })

    pageMux = http.NewServeMux()
    pageMux.HandleFunc(handlers.FileServer("/disk", "./disk"))
    pageMux.HandleFunc(handlers.PathAssert("/", func(w http.ResponseWriter, r *http.Request) {
        http.Redirect(w, r, "/chiyoi", http.StatusPermanentRedirect)
    }))
    pageMux.HandleFunc(handlers.Favicon("./assets/chiyoi/icon.png"))
    pageMux.HandleFunc(handlers.JSPageWithAssets("chiyoi"))
    pageMux.HandleFunc(nacho.Nacho())
    pageMux.HandleFunc(handlers.JSPageWithAssets("jigokutsuushin"))
    pageMux.HandleFunc(handlers.JSPageWithAssets("shigure"))
    pageMux.HandleFunc(handlers.UploadFile("upload", "./disk"))

    var certManager = server.NewCertManager(hosts, "cert-cache")
    httpServer = server.NewHttpServer(certManager.HTTPHandler(apiMux))
    httpsServer = server.NewHttpsServer(pageMux, certManager)
}

func main() {
    if os.Getenv("ENVIRONMENT") == "prod" {
        go func() {
            logger.Println("serving http.")
            if err := httpServer.ListenAndServe(); err != http.ErrServerClosed {
                debugger.Println("httpServer.ListenAndServe:", err)
            }
        }()
        go func() {
            logger.Println("serving https.")
            if err := httpsServer.ListenAndServeTLS("", ""); err != http.ErrServerClosed {
                debugger.Println("httpsServer.ListenAndServeTLS:", err)
            }
        }()
    } else {
        httpServer.Addr = ":8088"
        go func() {
            logger.Println("serving :8088")
            if err := httpServer.ListenAndServe(); err != http.ErrServerClosed {
                debugger.Println("httpServer.ListenAndServe:", err)
            }
        }()
        httpsServer.Addr = ":4433"
        go func() {
            logger.Println("serving :4433")
            if err := httpsServer.ListenAndServe(); err != http.ErrServerClosed {
                debugger.Println("httpsServer.ListenAndServe:", err)
            }
        }()
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

func stop(ser *http.Server) {
    var timer, cancel = context.WithTimeout(context.Background(), time.Second*5)
    defer cancel()
    if err := ser.Shutdown(timer); err != nil {
        debugger.Println("ser.Shutdown:", err)
    }
}
