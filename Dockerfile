FROM node:14-alpine
LABEL name "MoreToLearn BOT"
LABEL version "0.0.1"
WORKDIR /usr/mtl

COPY package*.json ./
RUN npm i
ENV NODE_ENV=production
RUN npm prune
COPY . .
RUN npm run build

CMD [ "node", "dist/index.js"]
