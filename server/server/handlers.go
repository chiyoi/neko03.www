package server

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"text/template"
    
    "neko03.com/www/utils"
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
        if utils.PathConstrain("/favicon.ico", w, r) {
            if len(r.Header["Referer"]) > 0 {
                var path = utils.Must(url.Parse(r.Header["Referer"][0])).Path
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
    var script = utils.Must(ioutil.ReadFile("view/index.js"))
    utils.Must(view.Parse(fmt.Sprintf(baseHTML, script)))
    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        if utils.PathConstrain("/", w, r) {
            utils.Assert(view.Execute(w, nil))
        }
    })
}

func jigokutsuushin(mux *http.ServeMux) {
    var view = template.New("main")
    var script = utils.Must(ioutil.ReadFile("view/jigokutsuushin.js"))
    utils.Must(view.Parse(fmt.Sprintf(baseHTML, script)))
    mux.HandleFunc("/jigokutsuushin", func(w http.ResponseWriter, r *http.Request) {
        if utils.PathConstrain("/jigokutsuushin", w, r) {
            utils.Assert(view.Execute(w, nil))
        }
    })
}
