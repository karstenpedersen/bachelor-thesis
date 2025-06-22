FROM debian:bullseye-slim

RUN apt-get update && apt-get install -y \
    bash \
    curl \
    grep \
    exiftool \
    wget \
    && rm -rf /var/lib/apt/lists/*


RUN mkdir -p /run/solution

WORKDIR /app

COPY . .

RUN chmod +x solver.sh

CMD ["/bin/bash", "./solver.sh"]



