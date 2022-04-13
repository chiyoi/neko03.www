package handlers

import (
	"encoding/json"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"neko03.com/www/utils"
)

type Data struct {
    Images string
}
type Img struct {
    Path string `json:"path"`
    Width int `json:"width"`
    Height int `json:"height"`
}

func Nacho() http.HandlerFunc {
    var filepaths = utils.Must(filepath.Glob("assets/nacho/photos/*"))
    var imgs = make([]Img, 0)
    for _, filepath := range filepaths {
        var imgReader = utils.Must(os.Open(filepath))
        defer imgReader.Close()
        conf, _, err := image.DecodeConfig(imgReader)
        if err != nil {
            log.Printf("err reading %s: %s", filepath, err)
        } else {
            imgs = append(imgs, Img{
                Path: "/"+filepath,
                Width: conf.Width,
                Height: conf.Height,
            })
        }
    }
    var imgs_b = utils.Must(json.Marshal(imgs))
    var data = Data{
        Images: string(imgs_b),
    }
    var handler = JSPage("nacho", data)
    return handler
}
