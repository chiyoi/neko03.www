package server

import (
	"crypto/tls"
	"log"
	"net/http"
	"os"

	"golang.org/x/crypto/acme/autocert"
)

func Mux() *http.ServeMux {
    var mux = new(http.ServeMux)
    RegisterHandlers(mux)
    return mux
}

type Servers_T struct {
    mux *http.ServeMux
    certManager *autocert.Manager
    httpsServer *http.Server
    httpServer *http.Server
}
func (ser *Servers_T) serveHTTP() {
    log.Fatal(ser.httpServer.ListenAndServe())
}
func (ser *Servers_T) serveHTTPS() {
    log.Fatal(ser.httpsServer.ListenAndServeTLS("", ""))
}
func (ser *Servers_T) Start() {
    if os.Getenv("TERM_PROGRAM") == "Apple_Terminal" {
        ser.httpServer.Addr = ":8088"
        ser.httpServer.Handler = ser.mux
        log.Println("Serving :8088")
        ser.serveHTTP()
    } else {
        ser.httpServer.Addr = ":http"
        ser.httpServer.Handler = ser.certManager.HTTPHandler(ser.mux)
        log.Println("Serving http/https.")
        go ser.serveHTTP()
        ser.serveHTTPS()
    }
}

func Servers(mux *http.ServeMux) *Servers_T {
    var certManager = new(autocert.Manager)
    certManager.Prompt = autocert.AcceptTOS
    certManager.HostPolicy = autocert.HostWhitelist("www.neko03.com")
    certManager.Cache = autocert.DirCache("cert-cache")

    var httpsServer = new(http.Server)
    httpsServer.Addr = ":https"
    httpsServer.Handler = mux
    var tlsConfig = new(tls.Config)
    tlsConfig.GetCertificate = certManager.GetCertificate
    httpsServer.TLSConfig = tlsConfig

    var httpServer = new(http.Server)

    var ser = new(Servers_T)
    ser.mux = mux
    ser.certManager = certManager
    ser.httpsServer = httpsServer
    ser.httpServer = httpServer
    return ser
}
