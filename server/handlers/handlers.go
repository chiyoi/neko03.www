package handlers

import (
	"fmt"
	"io/ioutil"
	_ "log"
	"net/http"
	"net/url"
	"path/filepath"
	"strings"
	"text/template"

	"neko03.com/www/utils"
)

const baseHTML = "<div id=\"noscript\">Javascript is required.</div><script>%s</script>\n"

type Mux struct {
    mu *http.ServeMux
    Hosts []string
}

func NewMux() *Mux {
    var serveMux = new(http.ServeMux)

    var mux = new(Mux)
    mux.mu = serveMux
    return mux
}

func (mux *Mux) RegisterHandleFunc(pattern string, handlerFunc http.HandlerFunc, setHeaders func(w http.ResponseWriter, r *http.Request)) {
    mux.mu.HandleFunc(pattern, func(w http.ResponseWriter, r *http.Request) {
        if utils.HostAssert(mux.Hosts, w, r) && utils.PathAssert(pattern, w, r) {
            if setHeaders != nil {
                setHeaders(w, r)
            }
            handlerFunc(w, r)
        }
    })
}
func (mux *Mux) RegisterFileServer(pattern string, dir string, setHeaders func(w http.ResponseWriter, r *http.Request)) {
    fs := http.StripPrefix(pattern, http.FileServer(http.Dir(dir)))
    mux.mu.HandleFunc(pattern, func(w http.ResponseWriter, r *http.Request) {
        if setHeaders != nil {
            setHeaders(w, r)
        }
        fs.ServeHTTP(w, r)
    })
}
func (mux *Mux) RegisterFavicon(handlerFunc http.HandlerFunc) {
    mux.RegisterHandleFunc("/favicon.ico", handlerFunc, nil)
}
func (mux *Mux) GetHandler() *http.ServeMux {
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

func SetHeaderGZ(w http.ResponseWriter, r *http.Request) {
    if strings.HasSuffix(r.URL.Path, "gz") {
        w.Header().Set("Content-Encoding", "gzip")
    }
}
