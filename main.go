package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"neko03.com/www/pages"
)

var root = filepath.Dir(Must(os.Executable()))

func init() {
	pages.Init(root)
	registerFileServer()
	registerHandlers()
}

func main() {
	log.Println("listen on :80")
	err := http.ListenAndServe(":80", nil)
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
		pages.Index(w, r)
	})
}
