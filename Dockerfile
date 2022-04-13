FROM golang:1.18

WORKDIR /build/utils
COPY ./server/utils/go.* ./
RUN go mod download

WORKDIR /build/server
COPY ./server/server/go.* ./
RUN go mod download

WORKDIR /build
COPY ./server/go.* ./
RUN go mod download

COPY ./server/server/*.go ./server/
COPY ./server/utils/*.go ./utils/
COPY ./server/*.go ./
RUN CGO_ENABLED=0 go build -o ./target/www

FROM node:12.22.12
RUN npm -g install typescript@4.6.3 jsmin@1.0.1

WORKDIR /build
COPY ./view/src ./src
COPY ./view/build-view.sh ./
RUN ./build-view.sh

FROM alpine
WORKDIR /neko
COPY --from=0 /build/target/www ./
COPY ./assets ./assets
COPY --from=1 /build/target/* ./view/

CMD ["./www"]
