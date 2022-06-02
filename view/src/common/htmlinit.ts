var main: HTMLDivElement

function htmlinit() {
    function getOrCreate<K extends "html" | "body" | "head">(tagName: K): HTMLElementTagNameMap[K] {
        let node: HTMLElementTagNameMap[K]
        let node_ = document.getElementsByTagName(tagName)[0]
        if (!node_) {
            node = document.createElement(tagName)
        } else {
            node = node_
        }
        return node
    }
    try {
        remove(getElement("noscript"))
    } catch {
        console.log("cannot find: div#noscript")
    }
    let html = getOrCreate("html")
    new modify(html)
        .setAttr("lang", "en")
    let head = getOrCreate("head")
    html.appendChild(head)
    new append(head)
        .tag("meta", new Map([["charset", "utf-8"]]))
    let body = getOrCreate("body")
    html.append(body)
    new modify(body)
        .setStyle("height", "100vh")
        .setStyle("margin", "0")
        .setStyle("overflow", "hidden")
    main = createOn(body, "main")
    new modify(main)
        .setStyle("height", "100%")
}
