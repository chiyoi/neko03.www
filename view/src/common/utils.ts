type StyleList = Exclude<keyof CSSStyleDeclaration, "parentRule" | "length" | "getPropertyPriority" | "getPropertyValue" | "item" | "removeProperty" | "setProperty" | number | typeof Symbol.iterator>;
type StyleDeclare = Omit<CSSStyleDeclaration, "parentRule" | "length" | "getPropertyPriority" | "getPropertyValue" | "item" | "removeProperty" | "setProperty" | number | typeof Symbol.iterator>;
type ContentElementTagNameMap = Omit<HTMLElementTagNameMap, "html" | "head" | "body">;

function createOn<K extends Exclude<keyof ContentElementTagNameMap, "div">>(parentNode: HTMLElement, id: string, tagName: K): ContentElementTagNameMap[K]
function createOn(patentNode: HTMLElement, id: string): HTMLDivElement
function createOn<K extends keyof ContentElementTagNameMap>(parentNode: HTMLElement, id: string, tagName?: K): HTMLElementTagNameMap[K] | HTMLDivElement {
    let node: HTMLElementTagNameMap[K] | HTMLDivElement
    if (tagName) {
        node = document.createElement(tagName)
        node.id = id
    } else {
        node = document.createElement("div")
        node.id = id
    }
    parentNode.appendChild(node)
    return node
}

function getElement<K extends keyof HTMLElementTagNameMap>(id: string, tagName: K): HTMLElementTagNameMap[K]
function getElement(id: string): HTMLDivElement
function getElement<K extends keyof HTMLElementTagNameMap>(id: string, tagName?: K): HTMLElementTagNameMap[K] | HTMLDivElement {
    let node: HTMLElementTagNameMap[K] | HTMLDivElement
    let node_ = document.getElementById(id)
    let tagName_: string
    if (tagName) {
        tagName_ = tagName
    } else {
        tagName_ = "div"
    }
    if (node_ && node_.tagName.toLowerCase() === tagName_.toLowerCase()) {
        node = node_ as HTMLElementTagNameMap[K]
    } else {
        throw new Error(`element not exist: ${tagName_}#${id}.`)
    }
    return node
}

function remove(element: HTMLElement) {
    if (element.parentNode) {
        element.parentNode.removeChild(element)
    } else {
        throw new Error(`cannot remove ${element}`)
    }
}

class modify<E extends HTMLElement> {
    private node: E | HTMLBodyElement
    constructor(node: E | "body") {
        if (node === "body") {
            this.node = document.getElementsByTagName("body")[0]
        } else {
            this.node = node
        }
    }
    setAttr(attribute: string, value: string): modify<E> {
        this.node.setAttribute(attribute, value)
        return this
    }
    setContent(content: string): modify<E> {
        this.node.textContent = content
        return this
    }
    setStyle(style: StyleList, value: string): modify<E> {
        this.node.style[style] = value
        return this
    }
    setStyles(styles: Partial<StyleDeclare>): modify<E> {
        let key: keyof StyleDeclare
        for (key in styles) {
            this.node.style[key] = styles[key]!
        }
        return this
    }
    appendStyle(style: StyleList, value: string): modify<E> {
        this.node.style[style] += value
        return this
    }
    scale(width: string, height: string): modify<E> {
        this.setStyle("width", width)
            .setStyle("height", height)
        return this
    }
    anchor(pos: "middle" | "top" | "left" | "right" | "bottom"): modify<E> {
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
    offset(x: string, y: string): modify<E> {
        this.setStyle("position", "relative")
            .setStyle("top", y)
            .setStyle("left", x)
        return this
    }
    position(x: string, y: string): modify<E> {
        this.setStyle("position", "absolute")
            .setStyle("top", y)
            .setStyle("left", x)
        return this
    }
    translate(x: string, y: string): modify<E> {
        this.appendStyle("transform", `translate(${x},${y})`)
        return this
    }
    centralize(): modify<E> {
        this.anchor("middle")
            .position("50%", "50%")
        return this
    }
    disablePointer(): modify<E> {
        this.setStyle("pointerEvents", "none")
            .setStyle("webkitUserSelect", "none")
        return this
    }
}

class append<E extends HTMLElement> {
    private node: E | HTMLHeadElement
    constructor(node: E | "head") {
        if (node === "head") {
            this.node = document.getElementsByTagName("head")[0]
        } else {
            this.node = node
        }
    }
    tag(tagName: keyof HTMLElementTagNameMap, attribute: Map<string, string>): append<E>
    tag(tagName: keyof HTMLElementTagNameMap, content: string): append<E>
    tag(tagName: keyof HTMLElementTagNameMap, attribute: Map<string, string>, content: string): append<E>
    tag(tagName: keyof HTMLElementTagNameMap, attributeOrContent: Map<string, string> | string, content?: string): append<E> {
        let child = document.createElement(tagName)
        if (attributeOrContent) {
            if (typeof attributeOrContent === "string") {
                child.textContent = attributeOrContent
            } else {
                attributeOrContent.forEach((value, key) => child.setAttribute(key, value))
                content && (child.textContent = content)
            }
        } else {
            child.textContent = attributeOrContent!
        }
        this.node.appendChild(child)
        return this
    }
    favicon(path: string): append<E> {
        let favicon = document.createElement("link")
        new modify(favicon)
            .setAttr("rel", "shortcut icon")
            .setAttr("type", "image/png")
            .setAttr("href", path)
        this.node.appendChild(favicon)
        return this
    }
}
