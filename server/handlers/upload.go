package handlers

import (
	"crypto/sha256"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path"
)

func UploadFile(saveDir string) http.HandlerFunc {
    handleGet := JSPage("upload", nil)
    return func(w http.ResponseWriter, r *http.Request) {
        switch r.Method {
        case http.MethodPut, http.MethodPost:
            data, err := ioutil.ReadAll(r.Body)
            if err != nil {
                logger.Println("UploadFile/ioutil.ReadAll:", err)
                InternalServerError(w, r)
                return
            }

            var filename string
            if filename = r.Header.Get("filename"); filename == "" {
                filename = fmt.Sprintf("%x", sha256.Sum256(data))[:8]
            }
            if _, err := os.Stat(saveDir); err != nil {
                logger.Println("UploadFile/os.Stat:", err)
                InternalServerError(w, r)
                return
            }
            if err := os.WriteFile(path.Join(saveDir, filename), data, os.FileMode(0644)); err != nil {
                logger.Println("UploadFile/os.WriteFile:", err)
                InternalServerError(w, r)
                return
            }

            fmt.Fprintln(w, "upload ok")
        case http.MethodGet:
            handleGet(w, r)
        default:
            http.Error(w, "405 method not allowed", http.StatusMethodNotAllowed)
        }
    }
}
