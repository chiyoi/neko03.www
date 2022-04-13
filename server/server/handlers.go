package server

import (
	"fmt"
	"html/template"
	"io/ioutil"
	"net/http"
	"net/url"
	"path/filepath"

	"neko03.com/www/utils"
)

type Mux_T struct {
    mu *http.ServeMux
}

func Mux() *Mux_T {
    var serveMux = new(http.ServeMux)
    var mux = new(Mux_T)
    mux.mu = serveMux
    return mux
}

const baseHTML = `<div id="noscript">Javascript is required.</div><script>%s</script>\n`

func (mux *Mux_T) RegisterHandlers() {
	fs := http.FileServer(http.Dir("assets"))
	mux.mu.Handle("/assets/", http.StripPrefix("/assets/", fs))

    favicon(mux.mu)
    pages(mux.mu)
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

func pages(mux *http.ServeMux) {
    var pages = []string{
        "index",
        "jigokutsuushin",
    }
    var views = make(map[string]*template.Template)
    for _, page := range pages {
        var script = utils.Must(ioutil.ReadFile(filepath.Join("view", page+".js")))
        var view = utils.Must(template.New(page).Parse(fmt.Sprintf(baseHTML, script)))
        views[page] = view
    }

    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        if utils.PathConstrain("/", w, r) {
            utils.Assert(views["index"].Execute(w, nil))
        }
    })
    mux.HandleFunc("/jigokutsuushin", func(w http.ResponseWriter, r *http.Request) {
        if utils.PathConstrain("/jigokutsuushin", w, r) {
            utils.Assert(views["jigokutsuushin"].Execute(w, nil))
        }
    })
}
