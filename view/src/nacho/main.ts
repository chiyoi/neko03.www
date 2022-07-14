import {app, htmlInit, utils} from "../common/utils";

window.oncontextmenu = function(e) {
    e.preventDefault()
}
window.onload = function() {
    htmlInit()
    init()
    window.setInterval(mainloop, 1000 / frameRate)
}

type Image_T = {
    path: string,
    width: number,
    height: number,
}
let images: Image_T[]
let ymin: number
let ymax: number
let hmin: number
let interval: number
let moveSpeed: number
let laidImgs: Map<number, HTMLImageElement>
let rightId: number
let leftId: number
let frameRate: number

function init() {
    utils.editHead()
        .title("nachoneko")
    ymin = Math.floor(0.05 * app.clientHeight)
    ymax = Math.floor(0.4 * app.clientHeight)
    hmin = Math.floor(0.3 * app.clientHeight)
    interval = Math.floor(0.1 * app.clientWidth)
    frameRate = 24
    moveSpeed = 2
    fetch("./img_info.json").then(response => {
        if (!response.ok) {
            throw new Error(`error fetching ${response.url}: ${response.statusText}`)
        }
        return response.json()
    }).then(data => {
        images = data as Image_T[]
        laidImgs = new Map<number, HTMLImageElement>()
        rightId = 0
        newRight()
        leftId = rightId
    }).catch(err => {
        throw err
    })
}

function mainloop() {
    let leftImg = laidImgs.get(leftId)
    let rightImg = laidImgs.get(rightId)
    if (!leftImg || !rightImg) {
        throw new Error("internal error")
    }
    if (app.clientWidth - (rightImg.x + rightImg.width) >= interval) {
        newRight()
    }
    if (leftImg.x + leftImg.width < 0) {
        removeLeft()
    }
    laidImgs.forEach(moveImg)
}

function moveImg(img: HTMLImageElement) {
    let newx = img.x - moveSpeed
    utils.edit(img)
        .position(newx.toString() + "px", img.style["top"])
}

function newRight() {
    let index = Math.floor(Math.random() * images.length)
    let img = images[index]
    let y = Math.random() * (ymax - ymin) + ymin
    let x = app.clientWidth
    let hmax = app.clientHeight - y
    let h = Math.random() * (hmax - hmin) + hmin
    let w = img.width / img.height * h

    rightId += 1
    let imgNode = utils.append(app, `img${rightId}`, "img")
    utils.edit(imgNode)
        .setAttr("src", img.path)
        .scale(w.toString() + "px", h.toString() + "px")
        .position(x.toString() + "px", y.toString() + "px")
    laidImgs.set(rightId, imgNode)
}

function removeLeft() {
    if (!laidImgs.has(leftId)) {
        throw new Error(`cannot remove image: ${leftId}`)
    }
    utils.remove(laidImgs.get(leftId)!)
    laidImgs.delete(leftId)
    leftId += 1
}
