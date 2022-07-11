let app: HTMLDivElement;

function htmlinit() {
    try {
        utils.remove(utils.getElement("noscript"))
    } catch {
        console.log("cannot find: div#noscript")
    }

    let
        htmls = document.getElementsByTagName("html"),
        heads = document.getElementsByTagName("head"),
        bodys = document.getElementsByTagName("body")
    if (htmls.length !== 1 || heads.length !== 1 || bodys.length !== 1) {
        throw new Error("error number of basic element")
    }
    htmls[0].id = "html"
    heads[0].id = "head"
    bodys[0].id = "body"

    utils.edit(utils.getElement("html", "html"))
        .setAttr("lang", "en")
    utils.edit(utils.append(utils.getElement("head", "head"), "meta", "meta"))
        .setAttr("charset", "utf-8")
    let body = utils.getElement("body", "body")
    utils.edit(body)
        .setStyles({
            height: "100vh",
            margin: "0",
            overflow: "hidden",
        })
    app = utils.append(body, "app")
    utils.edit(app)
        .setStyles({
            height: "100%",
        })
}
