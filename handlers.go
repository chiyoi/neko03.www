package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"path/filepath"
	"text/template"
)

const _baseHtml = `<!DOCTYPE html><html><body><script>%s</script></body></html>`
type Data struct {
}

func registerHandlers() {
	favicon()
	index()
}

func favicon() {
	http.HandleFunc("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./assets/icon.png")
	})
}

func index() {
	var view = template.New("index")
	var script = Must(ioutil.ReadFile(filepath.Join("views", "index.js")))
	Must(view.Parse(fmt.Sprintf(_baseHtml, script)))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if PathConstrain("/", w, r) {
			Assert(view.Execute(w, nil))
		}
	})
}
