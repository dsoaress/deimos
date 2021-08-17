FROM node:16-alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

EXPOSE 3010

CMD ["yarn", "start:prod"]
