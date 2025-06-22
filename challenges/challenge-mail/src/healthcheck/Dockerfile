#
# challenge-mail healthcheck
# 

# === Builder
FROM golang:1.23.9-alpine3.20 AS builder

WORKDIR /app

COPY go.mod main.go ./

RUN go build -o healthcheck

# === Runtime
FROM alpine:3.20

RUN addgroup -S ctf && adduser -S ctf -G ctf

WORKDIR /app

COPY --from=builder /app/healthcheck healthcheck

USER ctf

CMD ["./healthcheck"]
