window.oncontextmenu = function(e) {e.preventDefault()}
window.onload = function() {
    htmlinit()
    main()
}

function main() {
    new append("head")
        .tag("title", "地獄通信")
        .favicon("/assets/jigokutsuushin/icon.png")
    new modify(neko)
        .setStyle("background", "#050006")
    playopening()
}

var timeout: number
function playopening() {
    let video = createOn(neko, "video", "video")
    new modify(video)
        .scale("480px", "270px")
        .setAttr("muted", "")
        .centralize()
    new append(video)
        .tag("source", new Map([
            ["src", "/assets/jigokutsuushin/video.mp4"],
            ["type", "video/mp4"]
        ]))
    let audio = createOn(neko, "audio", "audio")
    new append(audio)
        .tag("source", new Map([
            ["src", "/assets/jigokutsuushin/audio.mp3"],
            ["type", "audio/mpeg"]
        ]))
    video.onloadeddata = () => {
        video.play()
        audio.play()
    }
    video.onended = session1
    audio.onended = () => {remove(audio)}
}

function session2() {
    let formframe = getElement("formframe")
    let formopacity = 1
    let formfadeout = window.setInterval(() => {
        formopacity -= 0.01
        new modify(formframe).setStyle("opacity", `${formopacity}`)
        if (Number(formframe.style.opacity) <= 0) {
            window.clearInterval(formfadeout)
            remove(formframe)
            session2_1()
        }
    }, 1)
}
