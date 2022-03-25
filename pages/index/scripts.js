//{{define "script-menu-icon-onclick"}}
var menu = document.getElementById("menu");
if (menu.classList.contains("active")) {
    menu.classList.replace("active", "inactive");
} else if (menu.classList.contains("inactive")) {
    menu.classList.replace("inactive", "active");
} else {
    menu.classList.add("active");
}
//{{end}}
//{{define "script-menu-content-about-onclick"}}
//{{end}}
