package handlers

import (
	"fmt"
	"text/template"
	"io/ioutil"
	"net/http"
	"net/url"
	"path/filepath"

	"neko03.com/www/utils"
)

const baseHTML = "<div id=\"noscript\">Javascript is required.</div><script>%s</script>\n"

type Mux_T struct {
    mu *http.ServeMux
}

func Mux() *Mux_T {
    var serveMux = new(http.ServeMux)

    var mux = new(Mux_T)
    mux.mu = serveMux
    return mux
}

func (mux *Mux_T) RegisterHandleFunc(pattern string, handlerFunc http.HandlerFunc) {
    mux.mu.HandleFunc(pattern, func(w http.ResponseWriter, r *http.Request) {
        if utils.PathConstrain(pattern, w, r) {
            handlerFunc(w, r)
        }
    })
}
func (mux *Mux_T) RegisterFileServer(pattern string, dir string) {
    mux.mu.Handle(pattern, http.StripPrefix(pattern, http.FileServer(http.Dir(dir))))
}
func (mux *Mux_T) RegisterFavicon(handlerFunc http.HandlerFunc) {
    mux.RegisterHandleFunc("/favicon.ico", handlerFunc)
}
func (mux *Mux_T) GetHandler() *http.ServeMux {
    return mux.mu
}

func JSPage(name string, data any) http.HandlerFunc {
    var script = utils.Must(ioutil.ReadFile(filepath.Join("view", name+".js")))
    var view = utils.Must(template.New(name).Parse(fmt.Sprintf(baseHTML, script)))
    return func(w http.ResponseWriter, r *http.Request) {
        utils.Assert(view.Execute(w, data))
    }
}

func Favicon() http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        if len(r.Header["Referer"]) <= 0 {
            http.NotFound(w, r)
            return
        }
        var path = utils.Must(url.Parse(r.Header["Referer"][0])).Path
        switch path {
        case "/":
            http.ServeFile(w, r, "assets/index/icon.png")
        case "/jigokutsuushin":
            http.ServeFile(w, r, "assets/jigokutsushin/icon.png")
        default:
            http.NotFound(w, r)
        }
    }
}
