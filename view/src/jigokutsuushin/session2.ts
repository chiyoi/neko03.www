function session2() {
    let formframe = utils.getElement("formframe")
    let formopacity = 1
    let formfadeout = window.setInterval(() => {
        formopacity -= 0.01
        utils.edit(formframe).setStyle("opacity", `${formopacity}`)
        if (Number(formframe.style.opacity) <= 0) {
            window.clearInterval(formfadeout)
            utils.remove(formframe)
            session2_1()
        }
    }, 1)
}
function session2_1() {
    let origin = app.style.cursor
    utils.edit(app).setStyle("cursor", "wait")
    window.setTimeout(() => {
        utils.edit(app).setStyle("cursor", origin)
        popup()
    }, 2000)
}
var timeout: number
function popup() {
    let popupframe = utils.append(app, "popupframe")
    utils.edit(popupframe)
        .scale("480px", "180px")
        .setStyles({
            background: "#d6d6d6",
            border: "groove 2px",
            borderRadius:"3px",
        })
        .centralize()
    let popupprop = utils.append(popupframe, "popupprop", "p")
    utils.edit(popupprop)
        .scale("480px", "45px")
        .setContent("強い怨念が無ければ、受けいれない。")
        .setStyles({
            color: "#000000",
            fontFamily: "Times",
            textAlign: "center",
            fontSize: "23",
        })
        .centralize()
        .translate("0", "-100%")
    let button = utils.append(popupframe, "button", "button")
    utils.edit(button)
        .scale("50px", "31px")
        .setContent("確認")
        .setStyles({
            fontSize: "15",
            fontFamily: "Times",
            borderRadius: "2px",
        })
        .anchor("top")
        .position("50%", "67%")
        .setStyle("color", "#000000")
    button.onclick = session3
    timeout = window.setTimeout(session3, 8000)
}
