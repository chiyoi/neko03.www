package handlers

import (
    "fmt"
    "log"
    "net/http"
    "os"
    "path"
    "text/template"
)

const baseHTML = `
<!DOCTYPE html>
<html>
  <head>
    <script>%s</script>
  </head>
  <body>
    <div id="noscript">Javascript is required.</div>
  </body>
</html>
`

var debugger = log.New(os.Stderr, "[neko03.www/server/handlers] ", log.Ldate|log.Ltime|log.LUTC|log.Lshortfile)

func RegisterHandler(mux *http.ServeMux, pattern string, handlerFunc http.HandlerFunc) {
    mux.HandleFunc(pattern, func(w http.ResponseWriter, r *http.Request) {
        if r.URL.Path != pattern {
            http.NotFound(w, r)
            return
        }
        handlerFunc(w, r)
    })
}
func RegisterFileServer(mux *http.ServeMux, pattern string, dir string) {
    var fs = http.StripPrefix(pattern, http.FileServer(http.Dir(dir)))
    mux.HandleFunc(pattern, func(w http.ResponseWriter, r *http.Request) {
        fs.ServeHTTP(w, r)
    })
}
func RegisterFavicon(mux *http.ServeMux, filepath string) {
    mux.HandleFunc("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {
        http.ServeFile(w, r, filepath)
    })
}

func InternalServerError(w http.ResponseWriter, _ *http.Request) {
    http.Error(w, "500 internal server error", http.StatusInternalServerError)
}

func JSPage(name string, data any) http.HandlerFunc {
    script, err := os.ReadFile(path.Join("view", name+".js"))
    if err != nil {
        debugger.Println("JSPage/os.ReadFile:", err)
        return http.NotFoundHandler().(http.HandlerFunc)
    }
    view, err := template.New(name).Parse(fmt.Sprintf(baseHTML, script))
    if err != nil {
        debugger.Println("JSPage/template.Parse:", err)
        return http.NotFoundHandler().(http.HandlerFunc)
    }
    return func(w http.ResponseWriter, r *http.Request) {
        if err := view.Execute(w, data); err != nil {
            debugger.Println("JSPage/view.Execute:", err)
            InternalServerError(w, r)
            return
        }
    }
}
