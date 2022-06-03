window.oncontextmenu = function(e) {e.preventDefault()}
window.onload = function() {
    htmlinit()
    init()
    window.setInterval(mainloop, 1000/frameRate)
}

type Image_T = {
    path: string,
    width: number,
    height: number,
}
var images: Image_T[]
var ymin: number
var ymax: number
var hmin: number
var interval: number
var moveSpeed: number
var laidImgs: Map<number, HTMLImageElement>
var rightid: number
var leftid: number
var frameRate: number

function init() {
    utils.editHead()
        .title("nachoneko")
    ymin = Math.floor(0.05 * app.clientHeight)
    ymax = Math.floor(0.4 * app.clientHeight)
    hmin = Math.floor(0.3 * app.clientHeight)
    interval = Math.floor(0.1 * app.clientWidth)
    frameRate = 24
    moveSpeed = 2
    images = JSON.parse('{{.Images}}')
    laidImgs = new Map<number, HTMLImageElement>()
    rightid = 0
    newRight()
    leftid = rightid
}

function mainloop() {
    let leftimg = laidImgs.get(leftid)
    let rightimg = laidImgs.get(rightid)
    if (!leftimg || !rightimg) {throw new Error("internel error")}
    if (app.clientWidth - (rightimg.x + rightimg.width) >= interval) {
        newRight()
    }
    if (leftimg.x + leftimg.width < 0) {
        removeLeft()
    }
    laidImgs.forEach(moveImg)
}

function moveImg(img: HTMLImageElement) {
    let newx = img.x - moveSpeed
    utils.edit(img)
        .position(newx.toString()+"px", img.style["top"])
}

function newRight() {
    let index = Math.floor(Math.random() * images.length)
    let img = images[index]
    let y = Math.random() * (ymax - ymin) + ymin
    let x = app.clientWidth
    let hmax = app.clientHeight - y
    let h = Math.random() * (hmax - hmin) + hmin
    let w = img.width / img.height * h

    rightid += 1
    let imgNode = utils.append(app, `img${rightid}`, "img")
    utils.edit(imgNode)
        .setAttr("src", img.path)
        .scale(w.toString()+"px", h.toString()+"px")
        .position(x.toString()+"px", y.toString()+"px")
    laidImgs.set(rightid, imgNode)
}
function removeLeft() {
    if (!laidImgs.has(leftid)) {
        throw new Error(`cannot remove image: ${leftid}`)
    }
    utils.remove(laidImgs.get(leftid)!)
    laidImgs.delete(leftid)
    leftid += 1
}
