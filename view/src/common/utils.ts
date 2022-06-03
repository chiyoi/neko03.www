type ChangableStyle = Omit<CSSStyleDeclaration, "parentRule" | "length" | "getPropertyPriority" | "getPropertyValue" | "item" | "removeProperty" | "setProperty" | number | typeof Symbol.iterator>;

class ElementNotExistError extends Error {
    constructor(tagName: keyof HTMLElementTagNameMap, id: string) {
        super("element not exist: "+tagName+"#"+id)
    }
}
class NoParentNodeError extends Error {
    constructor(elem: HTMLElement) {
        super(elem.nodeName)
    }
}
class DefineUtils {
    append<K extends keyof HTMLElementTagNameMap>(parentNode: HTMLElement, id: string, tagName: K): HTMLElementTagNameMap[K]
    append(patentNode: HTMLElement, id: string): HTMLDivElement
    append<K extends keyof HTMLElementTagNameMap>(parentNode: HTMLElement, id: string, tagName?: K): HTMLElementTagNameMap[K] | HTMLDivElement {
        let elem: HTMLElementTagNameMap[K] | HTMLDivElement
        if (typeof tagName === "undefined") {
            elem = document.createElement("div")
        } else {
            elem = document.createElement(tagName)
        }
        elem.id = id
        parentNode.appendChild(elem)
        return elem
    }

    addStyleSheet(css: string) {
        let styleNode = utils.getElement("style", "style")
        if (styleNode === undefined) {
            let head = document.getElementsByTagName("head")[0]
            styleNode = utils.append(head, "style", "style")
            utils.edit(styleNode)
                .setAttr("type", "text/css")
        }
        utils.edit(styleNode)
            .addContent(css)
    }

    getElement<K extends keyof HTMLElementTagNameMap>(id: string, tagName: K): HTMLElementTagNameMap[K]
    getElement(id: string): HTMLDivElement
    getElement<K extends keyof HTMLElementTagNameMap>(id: string, tagName?: K): HTMLElementTagNameMap[K] | HTMLDivElement {
        let elem = document.getElementById(id)
        if (typeof tagName === "undefined") {
            if (elem === null || elem.tagName.toLowerCase() !== "div") {
                throw new ElementNotExistError("div", id)
            }
            return <HTMLDivElement>elem
        } else {
            if (elem === null || elem.tagName.toLowerCase() !== tagName.toLowerCase()) {
                throw new ElementNotExistError(tagName, id)
            }
            return <HTMLElementTagNameMap[K]>elem
        }
    }

    remove(elem: HTMLElement) {
        if (elem.parentNode === null) {
            throw new NoParentNodeError(elem)
        }
        elem.parentNode.removeChild(elem)
    }

    edit<E extends HTMLElement>(elem: E) {
        return new ElementEditor(elem)
    }
    editHead() {
        return new HeadEditor()
    }
}
var utils = new DefineUtils()

class ElementEditor<E extends HTMLElement> {
    private elem: E
    constructor(elem: E) {
        this.elem = elem
    }
    setAttr(attr: string, value: string) {
        this.elem.setAttribute(attr, value)
        return this
    }
    setAttrs(attrs: {[index: string]: string}) {
        for (let attr in attrs) {
            this.setAttr(attr, attrs[attr])
        }
        return this
    }
    setContent(content: string) {
        this.elem.textContent = content
        return this
    }
    addContent(content: string) {
        this.elem.textContent += content
        return this
    }
    setStyle(style: keyof ChangableStyle, value: string) {
        this.elem.style[style] = value
        return this
    }
    setStyles(styles: Partial<ChangableStyle>) {
        let key: keyof ChangableStyle
        for (key in styles) {
            this.elem.style[key] = styles[key]!
        }
        return this
    }
    scale(width: string, height: string) {
        this.setStyle("width", width)
            .setStyle("height", height)
        return this
    }
    anchor(pos: "middle" | "top" | "left" | "right" | "bottom") {
        switch (pos) {
            case "middle":
                this.translate("-50%", "-50%")
                break
            case "top":
                this.translate("-50%", "0")
                break
            case "left":
                this.translate("0", "-50%")
                break
            case "right":
                this.translate("0", "-100%")
                break
            case "bottom":
                this.translate("-100%", "0")
                break
        }
        return this
    }
    position(x: string, y: string) {
        this.setStyles({
            position: "absolute",
            left: x,
            top: y,
        })
        return this
    }
    translate(x: string, y: string) {
        let original = this.elem.style.transform
        this.setStyle("transform", original+`translate(${x},${y})`)
        return this
    }
    centralize() {
        this.anchor("middle")
            .position("50%", "50%")
        return this
    }
    disablePointer() {
        this.setStyles({
            cursor: "none",
            webkitUserSelect: "none",
        })
        return this
    }
}

class HeadEditor {
    private head: HTMLHeadElement
    constructor() {
        this.head = utils.getElement("head", "head")
    }
    title(name: string) {
        utils.edit(utils.append(this.head, "title", "title"))
            .setContent(name)
        return this
    }
    favicon(path: string) {
        utils.edit(utils.append(this.head, "favicon", "link"))
            .setAttr("rel", "shortcut icon")
            .setAttr("type", "image/png")
            .setAttr("href", path)
        return this
    }
}
