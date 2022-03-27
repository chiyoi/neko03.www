package handlers

import (
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

var home string
var templates []string

func init() {
	root, err := os.Executable()
	if err != nil {log.Fatal(err)}
	home = filepath.Join(filepath.Dir(root), "data", "index")
	templates = []string{
		filepath.Join(home, "layout.tmpl"),
		filepath.Join(home, "script.js"),
	}
}

func Index(w http.ResponseWriter, r *http.Request) {
	page, err := template.ParseFiles(templates...)
	if err != nil {log.Fatalf("ParseFileErr: %v", err)}
	if err := page.ExecuteTemplate(w, "main", nil); err != nil {log.Fatal(err)}
}
