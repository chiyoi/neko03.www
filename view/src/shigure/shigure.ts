window.oncontextmenu = function(e) {e.preventDefault()}
window.onload = function() {
    htmlinit()
    utils.editHead()
        .title("shigure")
    frameRate = 60
    moveSpeed = 50
    let font = new FontFace("lolikoapp", ttfurl)
    font.load().then(rander).catch(function(error) {
        nofont()
    })
}

var frameRate: number
var moveSpeed: number

var content = "時雨さま大大大大好き！"
var ttfurl = "url(/assets/shigure/lolikoneko.ttf"

function rander(loadedFont: FontFace) {
    document.fonts.add(loadedFont)
    let text = utils.append(app, "text")
    utils.edit(text)
        .setContent(content)
        .scale("1600px", "100px")
        .setStyles({
            "fontFamily": "lolikoapp",
            "fontSize": "100px",
            "textAlign": "center",
        })
        .translate("0", "-50%")
        .position((app.clientWidth + 100).toString()+"px", "50%")
    window.setInterval(update, 1000/frameRate)
}

function nofont() {
    let text = utils.append(app, "text")
    utils.edit(text)
        .setContent(content)
        .scale("1600px", "100px")
        .setStyles({
            "fontSize": "100px",
            "textAlign": "center",
        })
        .translate("0", "-50%")
        .position((app.clientWidth + 100).toString()+"px", "50%")
    window.setInterval(update, 1000/frameRate)
}

function update() {
    let text: HTMLDivElement
    try {
        text = utils.getElement("text")
    } catch(error) {
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
        .position(newx.toString()+"px", "50%")
}
