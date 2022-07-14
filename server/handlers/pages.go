package handlers

import (
    "crypto/sha256"
    "errors"
    "fmt"
    "io/ioutil"
    "net/http"
    "os"
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
    return "/" + name + "/", func(w http.ResponseWriter, r *http.Request) {
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
            http.NotFound(w, r)
            debugger.Println("unexpected path:", paths[0])
        }
    }
}

func JSPageWithAssets(name string) (pattern string, handler http.HandlerFunc) {
    var _, page = JSPage(name)
    return "/" + name + "/", func(w http.ResponseWriter, r *http.Request) {
        paths, err := pathSplit(r.URL.Path)
        if err != nil {
            InternalServerError(w, r)
            debugger.Println("pathSplit:", err)
        }
        switch paths[0] {
        case "assets":
            http.ServeFile(w, r, path.Join("assets", name, path.Join(paths[1:]...)))
        default:
            page(w, r)
        }
    }
}

func UploadFile(name string, saveDir string) (pattern string, handler http.HandlerFunc) {
    var _, page = JSPage(name)
    return "/" + name + "/", func(w http.ResponseWriter, r *http.Request) {
        switch r.Method {
        case http.MethodGet:
            page(w, r)
        case http.MethodPut, http.MethodPost:
            data, err := ioutil.ReadAll(r.Body)
            if err != nil {
                debugger.Println("ioutil.ReadAll:", err)
                InternalServerError(w, r)
                return
            }

            var filename string
            if filename = r.Header.Get("filename"); filename == "" {
                filename = fmt.Sprintf("%x", sha256.Sum256(data))[:8]
            }
            if _, err := os.Stat(saveDir); err != nil {
                debugger.Println("os.Stat:", err)
                InternalServerError(w, r)
                return
            }
            if err := os.WriteFile(path.Join(saveDir, filename), data, os.FileMode(0644)); err != nil {
                debugger.Println("os.WriteFile:", err)
                InternalServerError(w, r)
                return
            }

            if _, err := fmt.Fprintln(w, "upload ok"); err != nil {
                debugger.Println("fmt.Fprintln:", err)
                return
            }
        default:
            http.Error(w, "405 method not allowed", http.StatusMethodNotAllowed)
        }
    }
}
