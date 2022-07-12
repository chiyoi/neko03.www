package nacho

import (
    "encoding/json"
    "image"
    _ "image/jpeg"
    _ "image/png"
    "log"
    "neko03.com.www/handlers"
    "net/http"
    "os"
    "path"
    "path/filepath"
    "strings"
)

var debugger = log.New(os.Stderr, "[handlers/nacho] ", log.Ldate|log.Ltime|log.LUTC|log.Lshortfile)

type imgT struct {
    Path   string `json:"path"`
    Width  int    `json:"width"`
    Height int    `json:"height"`
}

func Nacho() (pattern string, handler http.HandlerFunc) {
    var name = "nacho"
    var _, page = handlers.JSPageWithAssets(name)
    filepaths, err := filepath.Glob(path.Join("assets", "nacho", "images", "*"))
    if err != nil {
        debugger.Println("Nacho/filepath.Glob:", err)
    }
    var imgs = make([]imgT, 0, len(filepaths))
    for _, file := range filepaths {
        if img, err := os.Open(file); err != nil {
            debugger.Println("Nacho/os.Open:", err)
        } else {
            if conf, _, err := image.DecodeConfig(img); err != nil {
                debugger.Printf("Nacho/image.DecodeConfig: fail to read %s: %s", file, err)
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
        debugger.Println("Nacho/json.Marshal:", err)
    }
    return "/" + name + "/", func(w http.ResponseWriter, r *http.Request) {
        paths := strings.Split(r.URL.Path, "/")
        if len(paths) <= 1 {
            handlers.InternalServerError(w, r)
            debugger.Println("JSPageWithAssets/path:", "len(paths) <= 1")
            return
        }
        paths = paths[2:]
        switch paths[0] {
        case "img_info.json":
            if _, err := w.Write(imgInfo); err != nil {
                debugger.Println("Nacho/w.Write:", err)
            }
        default:
            page(w, r)
        }
    }
}
