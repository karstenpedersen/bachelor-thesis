#
# challenge-mail users
# 

# === Builder
FROM golang:1.23.9 AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY *.go .

RUN go build -o users

# === Runtime
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN useradd -m -s /bin/bash ctf

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ENV CHROME_PATH=/usr/bin/chromium

WORKDIR /app

COPY --from=builder /app/users users

COPY --chown=ctf:ctf assets/ assets/

USER ctf

CMD ["./users"]
