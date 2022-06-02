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
  <head>
    <script>%s</script>
  </head>
  <body>
    <div id="noscript">Javascript is required.</div>
  </body>
</html>
`
var logger = log.New(os.Stderr, "[neko03.www/server/handlers]", log.Ldate|log.Ltime|log.LUTC|log.Lshortfile)

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

func InternalServerError(w http.ResponseWriter, r *http.Request) {
    http.Error(w, "500 internal server error", http.StatusInternalServerError)
}

func JSPage(name string, data any) http.HandlerFunc {
    script, err := os.ReadFile(path.Join("view", name+".js"))
    if err != nil {
        logger.Println("JSPage/os.ReadFile:", err)
        return http.NotFoundHandler().(http.HandlerFunc)
    }
    view, err := template.New(name).Parse(fmt.Sprintf(baseHTML, script))
    if err != nil {
        logger.Println("JSPage/templage.Parse:", err)
        return http.NotFoundHandler().(http.HandlerFunc)
    }
    return func(w http.ResponseWriter, r *http.Request) {
        if err := view.Execute(w, data); err != nil {
            logger.Println("JSPage/view.Execute:", err)
            InternalServerError(w, r)
            return
        }
    }
}
