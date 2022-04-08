package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"text/template"
)

const _baseHtml = `<!DOCTYPE html><html><body><script>%s</script></body></html>`

func registerFileServer() {
	fs := http.FileServer(http.Dir("assets"))
	http.Handle("/assets/", http.StripPrefix("/assets/", fs))
}
func registerHandlers() {
	favicon()
	index()
}

func favicon() {
	http.HandleFunc("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "assets/icon.png")
	})
}

func index() {
	var view = template.New("index")
	var script = Must(ioutil.ReadFile("views/target/index.js"))
	Must(view.Parse(fmt.Sprintf(_baseHtml, script)))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if PathConstrain("/", w, r) {
			Assert(view.Execute(w, nil))
		}
	})
}
