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
    mux                     *http.ServeMux

    httpHostname, httpsHostname string
)

func init() {
    if os.Getenv("ENVIRONMENT") == "prod" {
        httpHostname = "neko03.com"
        httpsHostname = "www.neko03.com"
    } else {
        httpHostname = "localhost:8088"
        httpsHostname = "localhost:4433"
    }
    hosts = []string{httpHostname, httpsHostname}

    pageMux := http.NewServeMux()
    pageMux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        if r.URL.Path != "/" {
            handlers.Teapot(w, r)
            return
        }
        http.Redirect(w, r, "/chiyoi/", http.StatusMovedPermanently)
    })
    pageMux.HandleFunc(handlers.FileServer("/disk/", "./disk"))
    pageMux.HandleFunc(handlers.Favicon("./assets/chiyoi/icon.png"))
    pageMux.HandleFunc(handlers.JSPageWithAssets("chiyoi"))
    pageMux.HandleFunc(nacho.Nacho())
    pageMux.HandleFunc(handlers.JSPageWithAssets("jigokutsuushin"))
    pageMux.HandleFunc(handlers.JSPageWithAssets("shigure"))
    pageMux.HandleFunc(handlers.UploadFile("upload", "./disk"))

    mux = http.NewServeMux()
    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        host := strings.ToLower(r.Host)
        switch host {
        case httpHostname:
            r.URL.Scheme = "https"
            switch r.URL.Path {
            case "/":
                r.URL.Host = "www.neko03.com"
            case "/github/":
                r.URL.Host = "github.com"
                r.URL.Path = path.Join("/chiyoi", r.URL.Path)
            }
            http.Redirect(w, r, r.URL.String(), http.StatusMovedPermanently)
        case httpsHostname:
            handler, _ := pageMux.Handler(r)
            handler.ServeHTTP(w, r)
        default:
            if r.URL.Path != "/" {
                handlers.Teapot(w, r)
                return
            }
            switch host {
            case "github.neko03.com":
                http.Redirect(w, r, "https://github.com/chiyoi/", http.StatusMovedPermanently)
            case "twitter.neko03.com":
                http.Redirect(w, r, "https://twitter.com/chiyoi2140/", http.StatusMovedPermanently)
            case "chiyoi.neko03.com":
                http.Redirect(w, r, "https://www.neko03.com/chiyoi/", http.StatusMovedPermanently)
            case "nacho.neko03.com":
                http.Redirect(w, r, "https://www.neko03.com/nacho/", http.StatusMovedPermanently)
            default:
                handlers.Teapot(w, r)
            }
            return
        }
    })

    var certManager = server.NewCertManager(hosts, "cert-cache")
    httpServer = server.NewHttpServer(certManager.HTTPHandler(mux))
    httpsServer = server.NewHttpsServer(mux, certManager)
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
