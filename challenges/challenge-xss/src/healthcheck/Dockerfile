FROM golang:1.22.11

WORKDIR /app

COPY main.go ./

RUN CGO_ENABLED=0 GOOS=linux go build -o /healthcheck main.go

CMD ["/healthcheck"]

