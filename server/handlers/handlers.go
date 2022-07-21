package handlers

import (
    "net/http"
    "os"

    "github.com/chiyoi/Neko03/utils"
)

var debugger = utils.NewLogger(os.Stderr, "[neko03/handlers] ")

func FileServer(path string, dir string) (pattern string, handler http.HandlerFunc) {
    var fs = http.StripPrefix(path, http.FileServer(http.Dir(dir)))
    return path, func(w http.ResponseWriter, r *http.Request) {
        fs.ServeHTTP(w, r)
    }
}

func Favicon(filepath string) (pattern string, handler http.HandlerFunc) {
    return "/favicon.ico", func(w http.ResponseWriter, r *http.Request) {
        http.ServeFile(w, r, filepath)
    }
}

func InternalServerError(w http.ResponseWriter, _ *http.Request) {
    http.Error(w, "500 internal server error", http.StatusInternalServerError)
}

func Teapot(w http.ResponseWriter, _ *http.Request) {
    http.Error(w, "418 I'm a teapot", http.StatusTeapot)
}
