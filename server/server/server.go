package server

import (
    "crypto/tls"
    "net/http"

    "golang.org/x/crypto/acme/autocert"
)

func NewCertManager(hosts []string) (certManager *autocert.Manager) {
    certManager = &autocert.Manager{
        Prompt:     autocert.AcceptTOS,
        Cache:      autocert.DirCache("cert-cache"),
        HostPolicy: autocert.HostWhitelist(hosts...),
    }
    return
}

func NewServers(mux *http.ServeMux, certManager *autocert.Manager) (httpServer, httpsServer *http.Server) {
    httpServer = &http.Server{
        Addr:    ":http",
        Handler: certManager.HTTPHandler(mux),
    }

    httpsServer = &http.Server{
        Addr:    ":https",
        Handler: mux,
        TLSConfig: &tls.Config{
            GetCertificate: certManager.GetCertificate,
        },
    }
    return
}
