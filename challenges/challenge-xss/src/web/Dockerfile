FROM node:20.18.3

RUN apt-get update && apt-get install -y curl bash && rm -rf /var/lib/apt/lists/*

RUN curl -o /usr/local/bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && chmod +x /usr/local/bin/wait-for-it.sh

RUN mkdir -p /app/node_modules && chown -R node:node /app

WORKDIR /app

USER node

COPY --chown=node:node package*.json .

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

CMD [ "sh", "-c", "wait-for-it.sh database:5432 && npx drizzle-kit generate && npx drizzle-kit push && npm run dev" ]
