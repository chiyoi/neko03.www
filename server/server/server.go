package server

import (
    "crypto/tls"
    "net/http"

    "golang.org/x/crypto/acme/autocert"
)

func NewCertManager(hosts []string, cacheDir string) (certManager *autocert.Manager) {
    certManager = &autocert.Manager{
        Prompt:     autocert.AcceptTOS,
        Cache:      autocert.DirCache(cacheDir),
        HostPolicy: autocert.HostWhitelist(hosts...),
    }
    return
}

func NewHttpServer(handler http.Handler) (httpServer *http.Server) {
    return &http.Server{
        Addr:    ":http",
        Handler: handler,
    }
}

func NewHttpsServer(handler http.Handler, certManager *autocert.Manager) (httpsServer *http.Server) {
    return &http.Server{
        Addr:    ":https",
        Handler: handler,
        TLSConfig: &tls.Config{
            GetCertificate: certManager.GetCertificate,
        },
    }
}
