#!/bin/zsh
docker stop neko03
docker rm neko03
docker run --name neko03 --volume cert-cache:/neko/cert-cache --volume /home/chiyoi/Projects/neko03.com/www/disk:/neko/disk -p 80:80 -p 443:443 -d chiyoi/neko03.www
