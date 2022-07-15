package nacho

import (
    "encoding/json"
    "image"
    _ "image/jpeg"
    _ "image/png"
    "net/http"
    "os"
    "path"
    "path/filepath"
    "strings"

    "neko03/handlers"
    "neko03/utils"
)

var debugger = utils.NewLogger(os.Stderr, "[neko03/handlers/nacho] ")

type imgT struct {
    Path   string `json:"path"`
    Width  int    `json:"width"`
    Height int    `json:"height"`
}

func Nacho() (pattern string, handler http.HandlerFunc) {
    var page http.Handler
    pattern, page = handlers.JSPageWithAssets("nacho")
    filepaths, err := filepath.Glob(path.Join("assets", "nacho", "images", "*"))
    if err != nil {
        debugger.Printf("filepath.Glob:", err)
    }
    var imgs = make([]imgT, 0, len(filepaths))
    for _, file := range filepaths {
        if img, err := os.Open(file); err != nil {
            debugger.Println("os.Open:", err)
        } else {
            if conf, _, err := image.DecodeConfig(img); err != nil {
                debugger.Printf("image.DecodeConfig: fail to read %s: %s", file, err)
            } else {
                imgs = append(imgs, imgT{
                    "." + "/assets" + "/images" + "/" + path.Base(file),
                    conf.Width,
                    conf.Height,
                })
            }
        }
    }
    imgInfo, err := json.Marshal(imgs)
    if err != nil {
        debugger.Println("json.Marshal:", err)
    }
    handler = func(w http.ResponseWriter, r *http.Request) {
        paths := strings.Split(r.URL.Path, "/")
        if len(paths) <= 1 {
            handlers.InternalServerError(w, r)
            debugger.Println("path:", "len(paths) <= 1")
            return
        }
        paths = paths[2:]
        switch paths[0] {
        case "img_info.json":
            if _, err := w.Write(imgInfo); err != nil {
                debugger.Println("w.Write:", err)
            }
        default:
            page.ServeHTTP(w, r)
        }
    }
    return
}
