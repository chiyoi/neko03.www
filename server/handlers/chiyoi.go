package handlers

import (
	"net/http"
	"os"
)

func Chiyoi() http.HandlerFunc {
    svg, err := os.ReadFile("./assets/chiyoi/twi_button_img.svg")
    if err != nil {
        debugger.Println("Chiyoi/os.ReadFile:", err)
        return http.NotFoundHandler().(http.HandlerFunc)
    }
    return JSPage("chiyoi", struct {Twi_button_img string} {
        string(svg),
    })
}
