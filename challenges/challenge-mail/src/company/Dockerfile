#
# challenge-mail company
# 

# === Builder
FROM golang:1.23.9-alpine3.20 AS builder

WORKDIR /app

COPY go.mod ./

RUN go mod download

COPY main.go .

RUN go build -o company

# === Runtime
FROM alpine:3.20

RUN addgroup -S ctf && adduser -S ctf -G ctf

WORKDIR /app

COPY --from=builder /app/company company

COPY pages/ pages/
COPY static/ static/
COPY templates/ templates/

USER ctf

CMD ["./company"]
