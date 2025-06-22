#
# challenge-mail solution
# 

FROM golang:1.23.9-alpine3.20

RUN mkdir -p /run/solution/

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY *.go .

COPY embeds/ embeds/

RUN go build -o solver

CMD ["./solver"]