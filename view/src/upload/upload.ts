
var notice: HTMLDivElement
window.onload = function() {
    htmlinit()
    notice = createOn(main, "notice")
    new modify(notice)
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
    let file: File
    let input = document.createElement("input")
    new modify(input)
        .setAttr("type", "file")
    input.onchange = function(ev: Event) {
        let curr = ev.target as HTMLInputElement
        if (!curr.files) {
            throw new Error("no file")
        }
        file = curr.files[0]
        new modify(notice)
            .setContent(`ready to upload${" "}"${file.name}"`)
    }
    let selectfile = createOn(main, "selectfile")
    new modify(selectfile)
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
        })
    selectfile.onclick = function(ev: MouseEvent) {
        input.click()
    }
    let uploadfile = createOn(main, "uploadfile")
    new modify(uploadfile)
        .scale("60px", "30px")
        .centralize()
        .translate("200%", "200%")
        .setContent("upload")
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
        })
    uploadfile.onclick = function(ev: MouseEvent) {
        postRequest(file)
    }

    main.ondragover = function(ev: DragEvent) {
        ev.preventDefault()
        new modify(main)
            .setStyles({
                cursor: "copy",
            })
    }
    main.ondragleave = function() {
        new modify(main)
            .setStyles({
                cursor: "",
            })
    }
    main.ondrop = function(ev: DragEvent) {
        ev.preventDefault()
        new modify(main)
            .setStyles({
                cursor: "",
            })
        if (!ev.dataTransfer) {
            throw new Error("no data transfer")
        }
        file = ev.dataTransfer.files[0]
        new modify(notice)
            .setContent(`ready to upload${" "}"${file.name}"`)
    }
}
function postRequest(file: File) {
    file.arrayBuffer().then(data => {
        new modify(notice)
            .setContent("uploading...")
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
    if (res.ok) {
        new modify(notice)
            .setContent("file uploaded.")
    } else {
        new modify(notice)
            .setContent(`error:${" "}[${res.status}]${" "}${res.statusText}`)
    }
}
