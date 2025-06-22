FROM node:20.18.3-alpine

# RUN mkdir -p /app/node_modules && chown -R node:node /app
RUN mkdir -p /app/node_modules

# RUN mkdir -p /run/solution && chown -R node:node /run/solution
RUN mkdir -p /run/solution

WORKDIR /app

# COPY --chown=node:node package*.json .
COPY package*.json .

# USER node

RUN npm install

COPY solver.js .

EXPOSE 80

CMD [ "npm", "start" ]
