FROM golang:1.18

WORKDIR /build
COPY ./server/go.* ./
RUN go mod download

COPY ./server/handlers/*.go ./handlers/
COPY ./server/server/*.go ./server/
COPY ./server/*.go ./
RUN CGO_ENABLED=0 go build -o ./target/www

FROM node:12.22.12
RUN npm -g install typescript@4.6.3 jsmin@1.0.1

WORKDIR /build/src
COPY ./view/src/common ./common

WORKDIR /build/src/chiyoi
COPY ./view/src/chiyoi/* ./
RUN tsc --outFile ../../target/chiyoi.js

WORKDIR /build/src/jigokutsuushin
COPY ./view/src/jigokutsuushin/* ./
RUN tsc --outFile ../../target/jigokutsuushin.js

WORKDIR /build/src/nacho
COPY ./view/src/nacho/* ./
RUN tsc --outFile ../../target/nacho.js

WORKDIR /build/src/shigure
COPY ./view/src/shigure/* ./
RUN tsc --outFile ../../target/shigure.js

WORKDIR /build/src/upload
COPY ./view/src/upload/* ./
RUN tsc --outFile ../../target/upload.js

WORKDIR /build/target
RUN for f in *.js; do jsmin --overwrite $f; done

FROM alpine
WORKDIR /neko
COPY --from=0 /build/target/www ./
COPY ./assets/assets ./assets
COPY ../gopkg/gopkg ./gopkg
COPY --from=1 /build/target/* ./view/

CMD ["./www"]
