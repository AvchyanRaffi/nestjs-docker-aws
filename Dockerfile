FROM node:14.9.0-alpine
RUN apk add --no-cache nodejs yarn
#FROM alpine:latest
#RUN apk add --no-cache nodejs npm
#WORKDIR /app
#COPY . /app
RUN yarn install
#EXPOSE 3000
ARG PORT=3000
