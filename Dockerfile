FROM node:10.15.3-alpine

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git curl openssh-client

RUN mkdir -p /usr/src/startr
WORKDIR /usr/src/startr

COPY ./package.json ./yarn.lock ./
RUN yarn

COPY . .
RUN yarn run build

ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
RUN yarn upload

ENV PORT=80
EXPOSE 80

CMD [ "sh", "-c", "./scripts/secrets -d && . ./conf/secrets/decrypted/env && ./www" ]