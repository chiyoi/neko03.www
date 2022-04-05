package main

import (
	"crypto/tls"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"golang.org/x/crypto/acme/autocert"
)

func init() {
	registerFileServer()
	registerHandlers()
}
func main() {
	cert, s := makeHttpsServer()
	log.Println("Serving http/https.")
	go func() {
		err := http.ListenAndServe(":http", cert.HTTPHandler(nil))
		log.Fatal(err)
	}()
	err := s.ListenAndServeTLS("", "")
	log.Fatal(err)
}

func makeHttpsServer() (*autocert.Manager, *http.Server) {
	certManager := &autocert.Manager{
		Prompt: autocert.AcceptTOS,
		HostPolicy: autocert.HostWhitelist("www.neko03.com"),
	}
	certManager.Cache = autocert.DirCache(makeCacheDir())
	server := &http.Server{
		Addr: ":https",
		TLSConfig: &tls.Config{
			GetCertificate: certManager.GetCertificate,
		},
	}
	return certManager, server
}
func makeCacheDir() string {
	dir := filepath.Join("/certCache", "cache-golang-autocert")
	Assert(os.MkdirAll(dir, 0700))
	return dir
}
