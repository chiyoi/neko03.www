package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"text/template"
)

const baseHTML = `<div id="noscript">Javascript is required.</div><script>%s</script>`

func RegisterHandlers(mux *http.ServeMux) {
	fs := http.FileServer(http.Dir("assets"))
	mux.Handle("/assets/", http.StripPrefix("/assets/", fs))

    favicon(mux)
	index(mux)
    jigokutsuushin(mux)
}

func favicon(mux *http.ServeMux) {
    mux.HandleFunc("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {
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

func index(mux *http.ServeMux) {
    var view = template.New("main")
    var script = Must(ioutil.ReadFile("view/target/index.js"))
    Must(view.Parse(fmt.Sprintf(baseHTML, script)))
    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        if PathConstrain("/", w, r) {
            Assert(view.Execute(w, nil))
        }
    })
}

func jigokutsuushin(mux *http.ServeMux) {
    var view = template.New("main")
    var script = Must(ioutil.ReadFile("view/target/jigokutsuushin.js"))
    Must(view.Parse(fmt.Sprintf(baseHTML, script)))
    mux.HandleFunc("/jigokutsuushin", func(w http.ResponseWriter, r *http.Request) {
        if PathConstrain("/jigokutsuushin", w, r) {
            Assert(view.Execute(w, nil))
        }
    })
}
