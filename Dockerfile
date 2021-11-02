FROM node:14.4.0-buster-slim

COPY . .

RUN npm install

ENTRYPOINT ["node", "/lib/main.js"]