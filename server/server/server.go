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
)

var debugger = log.New(os.Stderr, "[neko03.www/server/server]", log.LstdFlags|log.LUTC|log.Lshortfile)
var Logger = log.New(os.Stdout, "[neko03.www/server]", log.LstdFlags|log.LUTC)

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
        debugger.Println("ServeHTTP/ser.HttpServer.ListenAndServe:", err)
    }
}
func (ser *Servers) ServeHTTPS() {
    err := ser.HttpsServer.ListenAndServeTLS("", "")
    if err != http.ErrServerClosed {
        debugger.Println("ServeHTTPS/ser.HttpsServer/ListenAndServeTLS:", err)
    }
}
func (ser *Servers) Shutdown(ctx context.Context) {
    if err := ser.HttpServer.Shutdown(ctx); err != nil {
        debugger.Println("Shutdown/ser.HttpServer.Shutdown:", err)
    }
    if err := ser.HttpsServer.Shutdown(ctx); err != nil {
        debugger.Println("Shutdown/ser.HttpServer.Shutdown:", err)
    }
}

func Start(ser *Servers) {
    var ctx = context.Background()
    if os.Getenv("TERM_PROGRAM") == "Apple_Terminal" {
        Logger.Println("Serving :8088")
        ser.HttpServer.Addr = ":8088"
        redi := http.NewServeMux()
        redi.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
            http.Redirect(w, r, "http://:8088/", http.StatusPermanentRedirect)
        })
        go http.ListenAndServe(":http", redi)
        go ser.ServeHTTP()
    } else {
        Logger.Println("Serving http/https.")
        go ser.ServeHTTP()
        go ser.ServeHTTPS()
    }
    sig := make(chan os.Signal, 1)
    signal.Notify(sig, os.Interrupt)
    origPrefix := Logger.Prefix()
    Logger.SetPrefix("\r" + origPrefix)
    Logger.Println(<-sig)
    Logger.SetPrefix(origPrefix)
    timerCtx, cancel := context.WithTimeout(ctx, 5 * time.Second)
    defer cancel()
    ser.Shutdown(timerCtx)
}
