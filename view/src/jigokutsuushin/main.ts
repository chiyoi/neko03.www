import {app, htmlInit, utils} from "../common/utils";

window.oncontextmenu = function(e) {e.preventDefault()}
window.onload = function() {
    htmlInit()
    utils.editHead()
        .title("地獄通信")
        .favicon("./assets/icon.png")
    utils.edit(app)
        .setStyles({
            background: "#050006",
        })
    playOpening()
}

function playOpening() {
    let video = utils.append(app, "video", "video")
    utils.edit(video)
        .scale("480px", "270px")
        .setAttrs({
            "muted": "",
            "preload": "auto",
        })
        .centralize()
    utils.edit(utils.append(video, "video-source", "source"))
        .setAttr("src", "./assets/video.mp4")
        .setAttr("type", "video/mp4")
    let audio = utils.append(app, "audio", "audio")
    audio.preload = "auto"
    utils.edit(utils.append(audio, "audio-source", "source"))
        .setAttrs({
            "src": "./assets/audio.mp3",
            "type": "audio/mpeg",
        })
        
    video.onended = session1
    audio.onended = () => {utils.remove(audio)}
    video.oncanplay = () => {
        video.play().then(_ => {})
        audio.play().then(_ => {})
    }
}

let formFrame: HTMLDivElement
function session1() {
    utils.remove(utils.getElement("video", "video"))
    formFrame = utils.append(app, "formFrame")
    utils.edit(formFrame)
        .setStyles({
            opacity: "0",
        })
        .scale("720px", "300px")
        .centralize()
    let label = utils.append(formFrame, "label", "p")
    label.innerText = "あなたの怨み、晴らします。"
    utils.edit(label)
        .scale("720px", "50px")
        .setStyles({
            textAlign: "center",
            fontFamily: "Times",
            fontSize: "210%",
            letterSpacing: "1rem",
            color: "#ffffff",
        })
        .anchor("top")
        .position("50%", "0")
        .translate("4%", "0")
        .disablePointer()
    let input = utils.append(formFrame, "input", "input")
    utils.edit(input)
        .scale("400px", "40px")
        .setAttr("type", "text")
        .setStyles({
            fontSize: "140%",
            fontFamily: "Times",
            borderWidth: "3px",
            borderStyle: "groove",
            borderRadius: "4px",
        })
        .centralize()
        .translate("0", "-20%")
    let submit = utils.append(formFrame, "submit", "button")
    submit.innerText = "送信"
    utils.edit(submit)
        .scale("110px", "45px")
        .setStyles({
            textAlign: "center",
            fontFamily: "Times",
            fontSize: "20",
            letterSpacing: "0.4rem",
            color: "#000000",
            borderRadius: "4px",
        })
        .anchor("top")
        .position("50%", "67%")
    let formOpacity = 0
    let formFadeIn = window.setInterval(() => {
        formOpacity += 0.01
        utils.edit(formFrame)
            .setStyles({
                opacity: `${formOpacity}`,
            })
        if (Number(formFrame.style.opacity) >= 1) {
            window.clearInterval(formFadeIn)
        }
    }, 10)
    submit.onclick = session2
}

function session2() {
    let formOpacity = 1
    let formFadeOut = window.setInterval(() => {
        formOpacity -= 0.01
        utils.edit(formFrame)
            .setStyles({
                opacity: `${formOpacity}`,
            })
        if (Number(formFrame.style.opacity) <= 0) {
            window.clearInterval(formFadeOut)
            utils.remove(formFrame)
            session2_1()
        }
    }, 1)
}
function session2_1() {
    let origin = app.style.cursor
    utils.edit(app)
        .setStyles({
            cursor: "wait",
        })
    window.setTimeout(() => {
        utils.edit(app)
            .setStyles({
                cursor: origin,
            })
        popup()
    }, 2000)
}
let timeout: number
function popup() {
    let popupFrame = utils.append(app, "popupFrame")
    utils.edit(popupFrame)
        .scale("480px", "180px")
        .setStyles({
            background: "#d6d6d6",
            border: "groove 2px",
            borderRadius:"3px",
        })
        .centralize()
    let popupProp = utils.append(popupFrame, "popupProp", "p")
    popupProp.innerText = "強い怨念が無ければ、受けいれない。"
    utils.edit(popupProp)
        .scale("480px", "45px")
        .setStyles({
            color: "#000000",
            fontFamily: "Times",
            textAlign: "center",
            fontSize: "23",
        })
        .centralize()
        .translate("0", "-100%")
    let button = utils.append(popupFrame, "button", "button")
    button.innerText = "確認"
    utils.edit(button)
        .scale("50px", "31px")
        .setStyles({
            fontSize: "15",
            fontFamily: "Times",
            borderRadius: "2px",
        })
        .anchor("top")
        .position("50%", "67%")
        .setStyles({
            color: "#000000",
        })
    button.onclick = session3
    timeout = window.setTimeout(session3, 8000)
}

function session3() {
    window.clearTimeout(timeout)
    window.location.pathname += "/404"
}