FROM node:alpine

WORKDIR /app

COPY . .

RUN npm install
RUN apk add --no-cache bash

EXPOSE 8080

CMD [ "node", "server.js" ]
