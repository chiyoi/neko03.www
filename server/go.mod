module neko03.com/www/server

go 1.18

require (
	golang.org/x/crypto v0.0.0-20220411220226-7b82a4e95df4
	neko03.com/www/utils v0.0.0-00010101000000-000000000000
)

require (
	golang.org/x/net v0.0.0-20211112202133-69e39bad7dc2 // indirect
	golang.org/x/text v0.3.6 // indirect
)

replace neko03.com/www/utils => ../utils
