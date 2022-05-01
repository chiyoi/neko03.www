package server

import (
	"context"
	"crypto/tls"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"golang.org/x/crypto/acme/autocert"
	"neko03.com/www/utils"
)


type Servers struct {
    Mux *http.ServeMux
    CertManager *autocert.Manager
    HttpsServer *http.Server
    HttpServer *http.Server
}
func NewServers(mux *http.ServeMux) *Servers {
    var certManager = &autocert.Manager{
        Prompt: autocert.AcceptTOS,
        Cache: autocert.DirCache("cert-cache"),
    }

    var httpsServer = &http.Server{
        Addr: ":https",
        Handler: mux,
        TLSConfig: &tls.Config{
            GetCertificate: certManager.GetCertificate,
        },
    }

    var httpServer = &http.Server{
        Addr: ":http",
        Handler: certManager.HTTPHandler(mux),
    }

    var sers = &Servers{
        Mux: mux,
        CertManager: certManager,
        HttpServer: httpServer,
        HttpsServer: httpsServer,
    }
    return sers
}
func (ser *Servers) RegisterHostWhiteList(hosts...string) {
    ser.CertManager.HostPolicy = autocert.HostWhitelist(hosts...)
}
func (ser *Servers) ServeHTTP() {
    err := ser.HttpServer.ListenAndServe()
    if err != http.ErrServerClosed {
        log.Fatal(err)
    }
}
func (ser *Servers) ServeHTTPS() {
    err := ser.HttpsServer.ListenAndServeTLS("", "")
    if err != http.ErrServerClosed {
        log.Fatal(err)
    }
}
func (ser *Servers) Shutdown(ctx context.Context) {
    utils.Assert(ser.HttpServer.Shutdown(ctx))
    utils.Assert(ser.HttpsServer.Shutdown(ctx))
}

func Start(ser *Servers) {
    var ctx = context.Background()
    if os.Getenv("TERM_PROGRAM") == "Apple_Terminal" {
        log.Println("Serving :8088")
        ser.HttpServer.Addr = ":8088"
        redi := http.NewServeMux()
        redi.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
            http.Redirect(w, r, "http://:8088/", http.StatusPermanentRedirect)
        })
        go http.ListenAndServe(":http", redi)
        go ser.ServeHTTP()
    } else {
        log.Println("Serving http/https.")
        go ser.ServeHTTP()
        go ser.ServeHTTPS()
    }
    sig := make(chan os.Signal, 1)
    signal.Notify(sig, os.Interrupt)
    log.SetPrefix("\r")
    log.Println(<-sig)
    timerCtx, cancel := context.WithTimeout(ctx, 5 * time.Second)
    defer cancel()
    ser.Shutdown(timerCtx)
}
