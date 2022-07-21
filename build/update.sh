#!/bin/zsh
git pull
cd /home/chiyoi/Projects/neko03.com/www || return $?
./build/build-image.sh
./build/docker-entry.sh
