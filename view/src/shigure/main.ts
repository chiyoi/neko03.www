import {app, htmlInit, utils} from "../common/utils";

window.oncontextmenu = function(e) {
    e.preventDefault()
}
window.onload = function() {
    htmlInit()
    utils.editHead()
        .title("shigure")
    frameRate = 60
    moveSpeed = 50
    let font = new FontFace("lolikoneko", ttfURL)
    font.load().then(render).catch(() => noFont())
}

let frameRate: number
let moveSpeed: number

let content = "時雨さま大大大大好き！"
let ttfURL = "url(./assets/lolikoneko.ttf"

function render(loadedFont: FontFace) {
    document.fonts.add(loadedFont)
    let text = utils.append(app, "text")
    text.innerText = content
    utils.edit(text)
        .scale("1600px", "100px")
        .setStyles({
            "fontFamily": "lolikoneko",
            "fontSize": "100px",
            "textAlign": "center",
        })
        .translate("0", "-50%")
        .position((app.clientWidth + 100).toString() + "px", "50%")
    window.setInterval(update, 1000 / frameRate)
}

function noFont() {
    let text = utils.append(app, "text")
    text.innerText = content
    utils.edit(text)
        .scale("1600px", "100px")
        .setStyles({
            "fontSize": "100px",
            "textAlign": "center",
        })
        .translate("0", "-50%")
        .position((app.clientWidth + 100).toString() + "px", "50%")
    window.setInterval(update, 1000 / frameRate)
}

function update() {
    let text: HTMLDivElement
    try {
        text = utils.getElement("text")
    } catch (error) {
        return
    }
    let left = parseInt(text.style.left), width = parseInt(text.style.width)
    if (isNaN(left) || isNaN(width)) {
        throw new Error("internal error")
    }
    if (left + width < 0) {
        utils.remove(text)
        return
    }
    let newx = left - moveSpeed
    utils.edit(text)
        .position(newx.toString() + "px", "50%")
}
