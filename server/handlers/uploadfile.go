package handlers

import (
    "crypto/sha256"
    "fmt"
    "io/ioutil"
    "net/http"
    "os"
    "path"
)

func UploadFile(name string, saveDir string) (pattern string, handler http.HandlerFunc) {
    var page http.Handler
    pattern, page = JSPage(name)
    handler = func(w http.ResponseWriter, r *http.Request) {
        switch r.Method {
        case http.MethodGet:
            page.ServeHTTP(w, r)
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
    return
}
