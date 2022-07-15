#!/bin/zsh
cd /home/chiyoi/Projects/neko03.com/www
git pull
./build/build-image.sh
./build/docker-entry.sh
