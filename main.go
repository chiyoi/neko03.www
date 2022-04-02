package main

import (
	"crypto/tls"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"golang.org/x/crypto/acme/autocert"
	"neko03.com/www/handlers"
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

func registerFileServer() {
	fs := http.FileServer(http.Dir("./assets"))
	http.Handle("/assets/", http.StripPrefix("/assets/", fs))
}
func registerHandlers() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		handlers.Index(w, r)
	})
}
func makeHttpsServer() (*autocert.Manager, *http.Server) {
	certManager := &autocert.Manager{
		Prompt: autocert.AcceptTOS,
		HostPolicy: autocert.HostWhitelist("www.neko03.com"),
	}
	if cacheDir := makeCacheDir(); cacheDir != "" {
		certManager.Cache = autocert.DirCache(cacheDir)
	}
	server := &http.Server{
		Addr: ":https",
		TLSConfig: &tls.Config{
			GetCertificate: certManager.GetCertificate,
		},
	}
	return certManager, server
}
func makeCacheDir() string {
	dir := filepath.Join(os.TempDir(), "cache-golang-autocert")
	if err := os.MkdirAll(dir, 0700); err == nil {
		return dir
	}
	return ""
}
