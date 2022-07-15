package utils

import (
    "bytes"
    "io"
    "log"
    "net/http"
    "runtime"
)

func NewLogger(out io.Writer, prefix string) *log.Logger {
    return log.New(&logger{out}, prefix, log.LUTC|log.Ltime|log.Ldate|log.Lshortfile|log.Lmsgprefix)
}

type logger struct {
    out io.Writer
}

func (l *logger) Write(msg []byte) (n int, err error) {
    var funcName string
    if pc, _, _, ok := runtime.Caller(3); ok {
        funcName = runtime.FuncForPC(pc).Name()
    } else {
        funcName = "unknown"
    }
    pieces := bytes.SplitN(msg, []byte{' '}, 5)
    pieces = append(pieces, pieces[4])
    pieces[4] = []byte("(" + funcName + ")")
    n, err = l.out.Write(bytes.Join(pieces, []byte{' '}))
    return
}

func PathAssert(w http.ResponseWriter, r *http.Request, path string) bool {
    if r.URL.Path != path {
        http.NotFound(w, r)
        return false
    }
    return true
}
