package main

func main() {
    var mux = Mux()
    var ser = Servers(mux)
    ser.Start()
}
