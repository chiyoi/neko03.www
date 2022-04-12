function session1() {
    window.clearTimeout(timeout)
    remove(getElement("video", "video"))
    let formframe = createOn(neko, "formframe")
    new modify(formframe)
        .setStyle("opacity", "0")
        .scale("720px", "300px")
        .centralize()
    let label = createOn(formframe, "label", "p")
    new modify(label)
        .scale("720px", "50px")
        .setContent("あなたの怨み、晴らします。")
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
    let input = createOn(formframe, "input", "input")
    new modify(input)
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
    let submmit = createOn(formframe, "submmit", "button")
    new modify(submmit)
        .scale("110px", "45px")
        .setContent("送信")
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
    let formopacity = 0
    let formfadein = window.setInterval(() => {
        formopacity += 0.01
        new modify(formframe).setStyle("opacity", `${formopacity}`)
        if (Number(formframe.style.opacity) >= 1) {
            window.clearInterval(formfadein)
        }
    }, 10)
    submmit.onclick = session2
}

