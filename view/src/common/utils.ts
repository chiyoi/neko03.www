type ChangeableStyle = Omit<CSSStyleDeclaration, "parentRule" | "length" | "getPropertyPriority" | "getPropertyValue" | "item" | "removeProperty" | "setProperty" | number | typeof Symbol.iterator>;

class ElementNotExistError extends Error {
    constructor(tagName: keyof HTMLElementTagNameMap, id: string) {
        super("element not exist: " + tagName + "#" + id)
    }
}

class NoParentNodeError extends Error {
    constructor(elem: HTMLElement) {
        super(elem.nodeName)
    }
}

class Utils {
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

export const utils = new Utils()

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

    setStyles(styles: Partial<ChangeableStyle>) {
        let key: keyof ChangeableStyle
        for (key in styles) {
            this.elem.style[key] = styles[key]!
        }
        return this
    }

    scale(width: string, height: string) {
        this.setStyles({
            width: width,
            height: height,
        })
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
        this.setStyles({
            transform: original + `translate(${x},${y})`,
        })
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
        let nodes = document.getElementsByTagName("head")
        if (nodes.length !== 1) {
            throw new Error("error number of basic element")
        }
        this.head = nodes[0]
    }

    title(name: string) {
        utils.append(this.head, "title", "title").innerHTML = name
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

export let app: HTMLDivElement;

export function htmlInit() {
    try {
        utils.remove(utils.getElement("noscript"))
    } catch (ElementNotExistError) {
        console.log("cannot find: div#noscript")
    }

    let body = document.getElementsByTagName("body")[0]
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