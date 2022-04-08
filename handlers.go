package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"text/template"
)

const baseHTML = `<script>%s</script>`

func registerFileServer() {
	fs := http.FileServer(http.Dir("assets"))
	http.Handle("/assets/", http.StripPrefix("/assets/", fs))
}
func registerHandlers() {
    favicon()
	index()
    jigokutsuushin()
}

func favicon() {
    http.HandleFunc("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {
        if PathConstrain("/favicon.ico", w, r) {
            if len(r.Header["Referer"]) > 0 {
                var path = Must(url.Parse(r.Header["Referer"][0])).Path
                if path == "/" {
                    http.ServeFile(w, r, "assets/index/icon.png")
                } else if path == "/jigokutsuushin" {
                    http.ServeFile(w, r, "assets/jigokutsushin/icon.png")
                } else {
                    http.NotFound(w, r)
                }
            } else {
                http.NotFound(w, r)
            }
        }
    })
}

func index() {
    var view = template.New("main")
    var script = Must(ioutil.ReadFile("view/target/index.js"))
    Must(view.Parse(fmt.Sprintf(baseHTML, script)))
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        if PathConstrain("/", w, r) {
            Assert(view.Execute(w, nil))
        }
    })
}

func jigokutsuushin() {
    var view = template.New("main")
    var script = Must(ioutil.ReadFile("view/target/jigokutsuushin.js"))
    Must(view.Parse(fmt.Sprintf(baseHTML, script)))
    http.HandleFunc("/jigokutsuushin", func(w http.ResponseWriter, r *http.Request) {
        if PathConstrain("/jigokutsuushin", w, r) {
            Assert(view.Execute(w, nil))
        }
    })
}
