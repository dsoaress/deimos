FROM node:14-alpine as builder

USER node
WORKDIR /home/node

COPY . /home/node

RUN npm i -g yarn
RUN yarn build
RUN yarn start
