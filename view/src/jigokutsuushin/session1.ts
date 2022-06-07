function session1() {
    utils.remove(utils.getElement("video", "video"))
    let formframe = utils.append(app, "formframe")
    utils.edit(formframe)
        .setStyles({
            opacity: "0",
        })
        .scale("720px", "300px")
        .centralize()
    let label = utils.append(formframe, "label", "p")
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
    let input = utils.append(formframe, "input", "input")
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
    let submmit = utils.append(formframe, "submmit", "button")
    submmit.innerText = "送信"
    utils.edit(submmit)
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
    let formopacity = 0
    let formfadein = window.setInterval(() => {
        formopacity += 0.01
        utils.edit(formframe)
            .setStyles({
                opacity: `${formopacity}`,
            })
        if (Number(formframe.style.opacity) >= 1) {
            window.clearInterval(formfadein)
        }
    }, 10)
    submmit.onclick = session2
}

