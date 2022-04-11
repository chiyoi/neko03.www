package main

import (
	"crypto/tls"
	"log"
	"net/http"
	"os"

	"golang.org/x/crypto/acme/autocert"
)

func init() {
    registerFileServer()
    registerHandlers()
}
func main() {
    if os.Getenv("TERM_PROGRAM") == "Apple_Terminal" {
        log.Println("Serving :8088.")
        err := http.ListenAndServe(":8088", nil)
        log.Fatal(err)
    } else {
        startHttpsServer()
    }
}

func startHttpsServer() {
    certManager := &autocert.Manager{
        Prompt: autocert.AcceptTOS,
        HostPolicy: autocert.HostWhitelist("neko03.com"),
        Cache: autocert.DirCache("cert-cache"),
    }
    server := &http.Server{
        Addr: ":https",
        TLSConfig: &tls.Config{
            GetCertificate: certManager.GetCertificate,
        },
    }
    log.Println("Serving http/https.")
    go func() {
        err := http.ListenAndServe(":http", certManager.HTTPHandler(nil))
        log.Fatal(err)
    }()
    err := server.ListenAndServeTLS("", "")
    log.Fatal(err)
}
