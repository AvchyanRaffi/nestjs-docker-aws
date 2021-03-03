FROM node:14.9.0-alpine
RUN apk add --no-cache nodejs yarn
WORKDIR /usr/src/app
COPY . .
RUN yarn install
RUN yarn build
EXPOSE 4000
ARG PORT=4000
CMD yarn start:prod
