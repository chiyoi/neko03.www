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
function session2_1() {
    let origin = main.style.cursor
    new modify(main).setStyle("cursor", "wait")
    window.setTimeout(() => {
        new modify(main).setStyle("cursor", origin)
        popup()
    }, 2000)
}
var timeout: number
function popup() {
    let popupframe = createOn(main, "popupframe")
    new modify(popupframe)
        .scale("480px", "180px")
        .setStyles({
            background: "#d6d6d6",
            border: "groove 2px",
            borderRadius:"3px",
        })
        .centralize()
    let popupprop = createOn(popupframe, "popupprop", "p")
    new modify(popupprop)
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
    let button = createOn(popupframe, "button", "button")
    new modify(button)
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
