var notice: HTMLDivElement
window.onload = function() {
    htmlinit()
    utils.editHead()
        .title("upload")
    notice = utils.append(app, "notice")
    utils.edit(notice)
        .scale("1000px", "50px")
        .centralize()
        .setContent("drop file here to upload.")
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
        utils.edit(notice)
            .setContent("ready to upload "+file.name)
    }
    let selectfile = utils.append(app, "selectfile")
    utils.edit(selectfile)
        .scale("60px", "30px")
        .centralize()
        .translate("-200%", "200%")
        .setContent("select file")
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
    selectfile.onclick = function(ev: MouseEvent) {
        input.click()
    }
    let uploadfile = utils.append(app, "uploadfile")
    utils.edit(uploadfile)
        .scale("60px", "30px")
        .centralize()
        .translate("200%", "200%")
        .setContent("upload file")
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
    uploadfile.onclick = function(ev: MouseEvent) {
        if (typeof file === "undefined") {
            return
        }
        postRequest(file)
        file = undefined
    }
    let browsefile = utils.append(app, "browsefile")
    utils.edit(browsefile)
        .scale("60px", "30px")
        .centralize()
        .translate("0", "200%")
        .setContent("browse file")
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
    browsefile.onclick = function(ev: MouseEvent) {
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
        utils.edit(notice)
            .setContent("ready to upload "+file.name)
    }
}
var interval: number
function postRequest(file: File) {
    let loadanime = "..."
    file.arrayBuffer().then(data => {
        interval = window.setInterval(function() {
            utils.edit(notice)
                .setContent(`uploading${loadanime}`)
            if (loadanime === "...") {
                loadanime = "."
            } else if (loadanime === ".") {
                loadanime = ".."
            } else if (loadanime === "..") {
                loadanime = "..."
            }
        }, 500)
        fetch("/upload", {
            method: "POST",
            headers: {
                "filename": file.name,
            },
            body: data,
        }).then(uploaded)
    })
}

function uploaded(res: Response) {
    window.clearInterval(interval)
    if (res.ok) {
        utils.edit(notice)
            .setContent("file uploaded.")
    } else {
        utils.edit(notice)
            .setContent("error: ["+res.status+"] "+res.statusText)
    }
}
