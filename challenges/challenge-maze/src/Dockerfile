FROM python:3.11-slim

RUN apt-get update && \
    apt-get install -y socat && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /chal

COPY maze_game.py .
COPY maze_map.py .
COPY run.sh .
RUN chmod +x run.sh

EXPOSE 1337

CMD ["./run.sh"]