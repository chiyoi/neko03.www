package pages

import (
	"html/template"
	"log"
	"net/http"
	"path/filepath"

	"neko03.com/www/pages/index"
)

var root string
var templates []string
var funcs = template.FuncMap{
	"list": func(elements ...any) []any {
		return []any(elements)
	},
}

func Init(root_ string) {
	root = filepath.Join(root_, "pages")
	index.Init(root)

	templates = []string{
		filepath.Join(root, "common", "layout.html"),
		filepath.Join(root, "common", "style.css"),
	}
}

func Index(w http.ResponseWriter, r *http.Request) {
	page, err := template.ParseFiles(templates...)
	if err != nil {
		log.Fatal(err)
	}
	page.Funcs(funcs)
	index.MakePage(page)
	if err := page.ExecuteTemplate(w, "page", nil); err != nil {
		log.Fatal(err)
	}
}
