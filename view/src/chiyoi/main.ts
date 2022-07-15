import {app, htmlInit, utils} from "../common/utils";

window.oncontextmenu = function(e) {
    e.preventDefault()
}
window.onload = function() {
    htmlInit()
    utils.editHead()
        .favicon("./icon.png")
    let icon_frame = utils.append(app, "icon_frame")
    utils.edit(icon_frame)
        .scale("150px", "200px")
        .centralize()
        .translate("0", "-30%")
    let icon = utils.append(icon_frame, "icon", "img")
    utils.edit(icon)
        .scale("150px", "150px")
        .setAttr("src", "./assets/icon.png")
        .setStyles({
            clipPath: "circle(50%)",
        })
        .disablePointer()
    let disp = utils.append(icon_frame, "disp")
    disp.innerText = "CHIYOI"
    utils.edit(disp)
        .scale("150px", "50px")
        .setStyles({
            textAlign: "center",
            fontWeight: "400",
            fontSize: "200%",
            fontFamily: "Menlo",
            letterSpacing: "0.3rem",
        })
        .translate("1.5%", "30%")
        .disablePointer()

    let twi_button = utils.append(app, "twi_button", "img")
    utils.edit(twi_button)
        .scale("30px", "30px")
        .centralize()
        .translate("-500%", "-500%")
        .setStyles({
            cursor: "pointer",
        })
        .setAttr("src", "./assets/twi_button_img.svg")
    twi_button.onclick = function() {
        location.href = "https://twitter.neko03.com/"
    }

    let upload_button = utils.append(app, "upload_button")
    utils.edit(upload_button)
        .scale("60px", "30px")
        .centralize()
        .translate("-100%", "300%")
        .setStyles({
            textAlign: "center",
            fontWeight: "10",
            fontSize: "50%",
            fontFamily: "Menlo",
            letterSpacing: "0.1rem",
            borderStyle: "solid",
            borderColor: "#39c5bb",
            borderWidth: "1px",
            borderRadius: "0px 50px 50px 50px",
            cursor: "pointer",
        })
    upload_button.innerText = "upload file"
    upload_button.onclick = function() {
        location.href = "/upload"
    }
} 
