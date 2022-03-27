function main() {
    var html = document.getElementsByTagName("html")[0]
    html.setAttribute("lang", "en-US")
    var body = document.getElementsByTagName("body")[0]
    body.style.height = "100vh"
    body.style.margin = 0
    buildApp()
}
function buildApp() {
    var app = document.getElementById("app")
    app.style.height = "100%"
    var icon_frame = document.createElement("div")
    setScale(icon_frame, "150px", "200px")
    middle(icon_frame)
    icon_frame.style.transform += "translate(0, -30%)"
    app.appendChild(icon_frame)
    var icon = document.createElement("img")
    setScale(icon, "150px", "150px")
    icon.src = "/assets/icon.png"
    icon.style.clipPath = "circle(50%)"
    icon_frame.appendChild(icon)
    var disp = document.createElement("div")
    setScale(disp, "150px", "50px")
    disp.innerText = "CHIYOI"
    disp.style.textAlign = "center"
    disp.style.fontWeight = "400"
    disp.style.fontSize = "200%"
    disp.style.letterSpacing = "0.3rem"
    disp.style.fontFamily = "Menlo"
    disp.style.transform += "translate(0, 30%)"
    disp.style.transform += "translate(1.5%)"
    disablePointer(disp)
    icon_frame.appendChild(disp)
}
function disablePointer(element) {
    element.style.pointerEvents = "none"
    element.style.webkitUserSelect = "none"
}
function setScale(element, width, height) {
    element.style.height = height
    element.style.width = width
}
function middle(element) {
    element.style.position = "relative"
    element.style.top = "50%"
    element.style.left = "50%"
    element.style.transform = "translate(-50%, -50%)"
}
window.onload = main
