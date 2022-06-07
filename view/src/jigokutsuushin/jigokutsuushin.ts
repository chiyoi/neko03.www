window.oncontextmenu = function(e) {e.preventDefault()}
window.onload = function() {
    htmlinit()
    utils.editHead()
        .title("地獄通信")
        .favicon("/assets/jigokutsuushin/icon.png")
    utils.edit(app)
        .setStyles({
            background: "#050006",
        })
    playopening()
}

function playopening() {
    let video = utils.append(app, "video", "video")
    utils.edit(video)
        .scale("480px", "270px")
        .setAttrs({
            "muted": "",
            "preload": "auto",
        })
        .centralize()
    utils.edit(utils.append(video, "video-source", "source"))
        .setAttr("src", "/assets/jigokutsuushin/video.mp4")
        .setAttr("type", "video/mp4")
    let audio = utils.append(app, "audio", "audio")
    audio.preload = "auto"
    utils.edit(utils.append(audio, "audio-source", "source"))
        .setAttrs({
            "src": "/assets/jigokutsuushin/audio.mp3",
            "type": "audio/mpeg",
        })
        
    video.onended = session1
    audio.onended = () => {utils.remove(audio)}
    video.oncanplay = () => {
        video.play()
        audio.play()
    }
}
