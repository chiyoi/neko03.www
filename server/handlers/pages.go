package handlers

import (
    "errors"
    "fmt"
    "net/http"
    "path"
    "strings"
)

const baseHTML = `
<!DOCTYPE html>
<html>
  <head>
    <script src="%s"></script>
  </head>
  <body>
    <div id="noscript">Javascript is required.</div>
  </body>
</html>
`

func pathSplit(path string) (paths []string, err error) {
    paths = strings.Split(path, "/")
    if len(paths) <= 1 {
        err = errors.New("error number of path")
        return
    }
    paths = paths[2:]
    return
}

func JSPage(name string) (pattern string, handler http.HandlerFunc) {
    var view = fmt.Sprintf(baseHTML, "/"+name+"/main.js")
    pattern = "/" + name + "/"
    handler = func(w http.ResponseWriter, r *http.Request) {
        paths, err := pathSplit(r.URL.Path)
        if err != nil {
            debugger.Println("pathSplit:", err)
        }
        switch paths[0] {
        case "":
            if _, err := w.Write([]byte(view)); err != nil {
                debugger.Println("fmt.Fprint:", err)
            }
        case "main.js":
            http.ServeFile(w, r, path.Join("view", name+".js"))
        default:
            Teapot(w, r)
            return
        }
    }
    return
}

func JSPageWithAssets(name string) (pattern string, handler http.HandlerFunc) {
    var page http.Handler
    pattern, page = JSPage(name)
    handler = func(w http.ResponseWriter, r *http.Request) {
        paths, err := pathSplit(r.URL.Path)
        if err != nil {
            InternalServerError(w, r)
            debugger.Println("pathSplit:", err)
        }
        switch paths[0] {
        case "assets":
            http.ServeFile(w, r, path.Join("assets", name, path.Join(paths[1:]...)))
        default:
            page.ServeHTTP(w, r)
        }
    }
    return
}
