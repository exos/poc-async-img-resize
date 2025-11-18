FROM node:lts-alpine

ARG SERVICE=""

WORKDIR /app

RUN npm install --cpu=x64 --os=linux --libc=musl sharp

ENV SERVICE=${SERVICE}

ADD entrypoint.sh / 

RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
