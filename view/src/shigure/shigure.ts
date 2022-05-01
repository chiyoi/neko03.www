window.oncontextmenu = function(e) {e.preventDefault()}
window.onload = function() {
    htmlinit()
    new append("head")
        .tag("title", "shigure")
    frameRate = 60
    moveSpeed = 50
    let font = new FontFace("lolikoneko", ttfurl)
    font.load().then(main)
}

var frameRate: number
var moveSpeed: number

var content = "時雨さま大大大大好き！"
var ttfurl = "url(/assets/shigure/lolikoneko.ttf"

function main(loadedFont: FontFace) {
    document.fonts.add(loadedFont)
    let text = createOn(neko, "text")
    new modify(text)
        .setContent(content)
        .scale("1600px", "100px")
        .setStyles({
            "fontFamily": "lolikoneko",
            "fontSize": "100px",
            "textAlign": "center",
        })
        .translate("0", "-50%")
        .position((neko.clientWidth + 100).toString()+"px", "50%")
    window.setInterval(update, 1000/frameRate)
}

function update() {
    let text: HTMLDivElement
    try {
        text = getElement("text")
    } catch(error) {
        return
    }
    let left = parseInt(text.style.left), width = parseInt(text.style.width)
    if (isNaN(left) || isNaN(width)) {
        throw new Error("internal error")
    }
    if (left + width < 0) {
        remove(text)
        return
    }
    let newx = left - moveSpeed
    new modify(text)
        .position(newx.toString()+"px", "50%")
}
