window.oncontextmenu = function(e) {e.preventDefault()}
window.onload = function() {
    htmlinit()
    new append("head")
        .tag("title", "地獄通信")
        .favicon("/assets/jigokutsuushin/icon.png")
    new modify(main)
        .setStyle("background", "#050006")
    playopening()
}

function playopening() {
    let video = createOn(main, "video", "video")
    new modify(video)
        .scale("480px", "270px")
        .setAttr("muted", "")
        .setAttr("preload", "auto")
        .centralize()
    new append(video)
        .tag("source", new Map([
            ["src", "/assets/jigokutsuushin/video.mp4"],
            ["type", "video/mp4"]
        ]))
    let audio = createOn(main, "audio", "audio")
    audio.preload = "auto"
    new append(audio)
        .tag("source", new Map([
            ["src", "/assets/jigokutsuushin/audio.mp3"],
            ["type", "audio/mpeg"]
        ]))
    video.onended = session1
    audio.onended = () => {remove(audio)}
    video.oncanplay = () => {
        video.play()
        audio.play()
    }
}
