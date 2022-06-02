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

type img_T struct {
    Path string `json:"path"`
    Width int `json:"width"`
    Height int `json:"height"`
}

func Nacho() http.HandlerFunc {
    filepaths, err := filepath.Glob(path.Join("assets", "nacho", "photos", "*"))
    if err != nil {
        logger.Println("Nacho/filepath.Glob:", err)
    }
    var imgs = make([]img_T, len(filepaths))
    for i, file := range filepaths {
        img, err := os.Open(file)
        if err != nil {
            logger.Println("Nacho/os.Open:", err)
            continue
        }
        defer img.Close()
        conf, _, err := image.DecodeConfig(img)
        if err != nil {
            logger.Printf("Nacho/image.DecodeConfig: err reading %s: %s", file, err)
            continue
        }
        imgs[i] = img_T{
            Path: fmt.Sprintf("/assets/nacho/photos/%s", path.Base(file)),
            Width: conf.Width,
            Height: conf.Height,
        }
    }
    imgList, err := json.Marshal(imgs)
    if err != nil {
        logger.Println("Nacho/json.Marshal:", err)
    }
    return JSPage("nacho", struct{Images string} {
        string(imgList),
    })
}
