package handlers

import (
    "encoding/json"
    "fmt"
    "image"
    _ "image/jpeg"
    _ "image/png"
    "net/http"
    "os"
    "path"
    "path/filepath"
)

type imgT struct {
    Path   string `json:"path"`
    Width  int    `json:"width"`
    Height int    `json:"height"`
}

func Nacho() http.HandlerFunc {
    filepaths, err := filepath.Glob(path.Join("assets", "nacho", "photos", "*"))
    if err != nil {
        debugger.Println("Nacho/filepath.Glob:", err)
    }
    var imgs = make([]imgT, len(filepaths))
    for i, file := range filepaths {
        img, err := os.Open(file)
        if err != nil {
            debugger.Println("Nacho/os.Open:", err)
            continue
        }
        defer func(img *os.File) {
            if err := img.Close(); err != nil {
                debugger.Println("Nacho/img.Close:", err)
            }
        }(img)
        conf, _, err := image.DecodeConfig(img)
        if err != nil {
            debugger.Printf("Nacho/image.DecodeConfig: err reading %s: %s", file, err)
            continue
        }
        imgs[i] = imgT{
            Path:   fmt.Sprintf("/assets/nacho/photos/%s", path.Base(file)),
            Width:  conf.Width,
            Height: conf.Height,
        }
    }
    imgList, err := json.Marshal(imgs)
    if err != nil {
        debugger.Println("Nacho/json.Marshal:", err)
    }
    return JSPage("nacho", struct{ Images string }{
        string(imgList),
    })
}
