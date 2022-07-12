FROM golang:1.18

WORKDIR /build
COPY ./server/go.* ./
RUN go mod download

COPY ./server ./
RUN CGO_ENABLED=0 go build -o ./target/www

FROM node:12.22.12

WORKDIR /build
COPY ./view/package.json ./view/package-lock.json ./
RUN npm install

COPY ./view ./
RUN npx webpack -o ./dist

FROM alpine

WORKDIR /neko
COPY ./assets/assets ./assets
COPY --from=0 /build/target/www ./neko03
COPY --from=1 /build/dist ./view

CMD ["./neko03"]
