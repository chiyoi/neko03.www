package server

import (
	"crypto/tls"
	"log"
	"net/http"
	"os"

	"golang.org/x/crypto/acme/autocert"
)


type Servers struct {
    mux *http.ServeMux
    certManager *autocert.Manager
    httpsServer *http.Server
    httpServer *http.Server
}
func NewServers(mux *http.ServeMux) *Servers {
    var certManager = new(autocert.Manager)
    certManager.Prompt = autocert.AcceptTOS
    certManager.Cache = autocert.DirCache("cert-cache")
    var tlsConfig = new(tls.Config)
    tlsConfig.GetCertificate = certManager.GetCertificate

    var httpsServer = new(http.Server)
    httpsServer.Addr = ":https"
    httpsServer.Handler = mux
    httpsServer.TLSConfig = tlsConfig

    var httpServer = new(http.Server)
    httpServer.Addr = ":http"
    httpServer.Handler = certManager.HTTPHandler(mux)

    var ser = new(Servers)
    ser.mux = mux
    ser.certManager = certManager
    ser.httpsServer = httpsServer
    ser.httpServer = httpServer
    return ser
}
func (ser *Servers) RegisterHostWhiteList(hosts...string) {
    ser.certManager.HostPolicy = autocert.HostWhitelist(hosts...)
}
func (ser *Servers) ServeHTTP(addr...string) {
    if len(addr) == 1 {
        ser.httpServer.Addr = addr[0]
    } else if len(addr) != 0 {
        log.Fatal("error addr")
    }
    log.Fatal(ser.httpServer.ListenAndServe())
}
func (ser *Servers) ServeHTTPS() {
    log.Fatal(ser.httpsServer.ListenAndServeTLS("", ""))
}

func Start(ser *Servers) {
    if os.Getenv("TERM_PROGRAM") == "Apple_Terminal" {
        log.Println("Serving :8088")
        ser.ServeHTTP(":8088")
    } else {
        log.Println("Serving http/https.")
        go ser.ServeHTTP()
        ser.ServeHTTPS()
    }
}
