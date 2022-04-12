package main

import "neko03.com/www/server"

func main() {
    var mux = server.Mux()
    var ser = server.Servers(mux)
    ser.Start()
}
