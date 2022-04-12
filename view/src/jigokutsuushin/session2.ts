function session2_1() {
    let origin = neko.style.cursor
    new modify(neko).setStyle("cursor", "wait")
    window.setTimeout(() => {
        new modify(neko).setStyle("cursor", origin)
        popup()
    }, 2000)
}
function popup() {
    let popupframe = createOn(neko, "popupframe")
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
