window.oncontextmenu = function(e) {e.preventDefault()}
window.onload = function() {
    htmlinit()
    new append("head")
        .tag("title", "chiyoi")
        .favicon("/assets/index/icon.png")
    let icon_frame = createOn(neko, "icon_frame")
    new modify(icon_frame)
        .scale("150px", "200px")
        .centralize()
        .translate("0", "-30%")
    let icon = createOn(icon_frame, "icon", "img")
    new modify(icon)
        .scale("150px", "150px")
        .setAttr("src", "/assets/index/icon.png")
        .setStyle("clipPath", "circle(50%)")
        .disablePointer()
    let disp = createOn(icon_frame, "disp")
    new modify(disp)
        .scale("150px", "50px")
        .setContent("CHIYOI")
        .setStyles({
            textAlign: "center",
            fontWeight: "400",
            fontSize: "200%",
            fontFamily: "Menlo",
            letterSpacing: "0.3rem",
        })
        .translate("1.5%", "30%")
        .disablePointer()
} 
