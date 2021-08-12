FROM node:16-alpine AS builder

WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:16-alpine

WORKDIR /app
COPY --from=builder /app ./

EXPOSE 3010

CMD ["npm", "run", "start:prod"]
