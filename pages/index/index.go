package index

import (
	"html/template"
	"log"
	"path/filepath"
)

var root string
var templates []string

func Init(root_ string) {
	root = filepath.Join(root_, "index")
	templates = []string{
		filepath.Join(root, "content.tmpl"),
		filepath.Join(root, "style.css"),
		filepath.Join(root, "scripts.js"),
		filepath.Join(root, "icon.svg"),
	}
}

func MakePage(page *template.Template) {
	if _, err := page.ParseFiles(templates...); err != nil {
		log.Fatal(err)
	}
}
