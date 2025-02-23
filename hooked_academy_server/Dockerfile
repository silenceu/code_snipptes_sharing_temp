# Build
FROM golang:1.20.2-alpine3.17 as builder

WORKDIR /build

COPY . .
RUN go install
RUN go build -o ./bin/hooked_academy_server

# Deploy
FROM alpine:3.17 as server

WORKDIR /app
COPY --from=builder /build/bin/ /app/

ENV HTTP_PORT 8080
ENV GIN_MODE release

EXPOSE $HTTP_PORT
ENTRYPOINT ./hooked_academy_server