#
# challenge-mail openssh
# 

FROM lscr.io/linuxserver/openssh-server:9.7_p1-r4-ls172

RUN apk add --update --no-cache python3 go nodejs

RUN go install github.com/mailhog/mhsendmail@latest && \
  mv /root/go/bin/mhsendmail /usr/local/bin/mhsendmail && \
  chmod +x /usr/local/bin/mhsendmail
