# syntax=docker/dockerfile:1.5
FROM node:20.12-slim AS base

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install --omit=dev && npm cache clean --force

FROM node:20.12-slim AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY tsconfig.json .
COPY src src

RUN npm run build

FROM base AS production

COPY --from=build /app/dist dist

CMD ["node", "dist/index.js"]

