import {app, htmlInit, utils} from "../common/utils";

let notice: HTMLDivElement
window.onload = function() {
    htmlInit()
    utils.editHead()
        .title("upload")
    notice = utils.append(app, "notice")
    notice.innerText = "drop file here to upload."
    utils.edit(notice)
        .scale("1000px", "50px")
        .centralize()
        .setStyles({
            textAlign: "center",
            fontWeight: "200",
            fontSize: "150%",
            fontFamily: "Menlo",
            letterSpacing: "0.1rem",
        })
    let file: File | undefined
    let input = document.createElement("input")
    utils.edit(input)
        .setAttr("type", "file")
    input.onchange = function(ev: Event) {
        let curr = ev.target as HTMLInputElement
        if (!curr.files) {
            throw new Error("no file")
        }
        file = curr.files[0]
        notice.innerText = "ready to upload " + file.name
    }
    let selectFile = utils.append(app, "selectFile")
    selectFile.innerText = "select file"
    utils.edit(selectFile)
        .scale("60px", "30px")
        .centralize()
        .translate("-200%", "200%")
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
    selectFile.onclick = function(_: MouseEvent) {
        input.click()
    }
    let uploadFile = utils.append(app, "uploadFile")
    uploadFile.innerText = "upload file"
    utils.edit(uploadFile)
        .scale("60px", "30px")
        .centralize()
        .translate("200%", "200%")
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
    uploadFile.onclick = function(_: MouseEvent) {
        if (typeof file === "undefined") {
            return
        }
        postRequest(file)
        file = undefined
    }
    let browseFile = utils.append(app, "browseFile")
    browseFile.innerText = "browse file"
    utils.edit(browseFile)
        .scale("60px", "30px")
        .centralize()
        .translate("0", "200%")
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
    browseFile.onclick = function(_: MouseEvent) {
        location.href = "/disk"
    }

    app.ondragover = function(ev: DragEvent) {
        ev.preventDefault()
        utils.edit(app)
            .setStyles({
                cursor: "copy",
            })
    }
    app.ondragleave = function() {
        utils.edit(app)
            .setStyles({
                cursor: "",
            })
    }
    app.ondrop = function(ev: DragEvent) {
        ev.preventDefault()
        utils.edit(app)
            .setStyles({
                cursor: "",
            })
        if (!ev.dataTransfer) {
            throw new Error("no data transfer")
        }
        file = ev.dataTransfer.files[0]
        notice.innerText = "ready to upload " + file.name
    }
}
let interval: number

function postRequest(file: File) {
    let loadAnime = "..."
    file.arrayBuffer().then(data => {
        interval = window.setInterval(function() {
            notice.innerText = `uploading${loadAnime}`
            if (loadAnime === "...") {
                loadAnime = "."
            } else if (loadAnime === ".") {
                loadAnime = ".."
            } else if (loadAnime === "..") {
                loadAnime = "..."
            }
        }, 500)
        fetch("/upload", {
            method: "POST",
            headers: {
                "filename": file.name,
            },
            body: data,
        }).then(uploaded).catch(err => {
            console.log(err)
        })
    })
}

function uploaded(res: Response) {
    window.clearInterval(interval)
    if (res.ok) {
        notice.innerText = "file uploaded."
    } else {
        notice.innerText = "error: [" + res.status + "] " + res.statusText
    }
}
