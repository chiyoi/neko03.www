#!/bin/zsh
git pull
./build-image.sh
./docker-entry.sh
