FROM node:12-alpine
WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN apk add --update --no-cache --virtual .build-deps \
      # extra-fetch
      git \
      # better-sqlite3
      build-base \
      python3 \
 && npm install -g pnpm \
 && pnpm install \
 && pnpm store prune \
 && apk del .build-deps

COPY . ./

RUN pnpm build \
 && mkdir /data \
 && ln -s /data data

ENV PUBSUB_HOST=0.0.0.0
ENV PUBSUB_PORT=8080
EXPOSE 8080
ENTRYPOINT ["pnpm"]
CMD ["--silent", "start"]
