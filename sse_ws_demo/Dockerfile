FROM node:20-slim as base

ENV PNPM_HOME="/pnpm"

ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

RUN corepack use pnpm@9.x

ADD . /app

FROM base AS prod-deps

WORKDIR /app/client
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

WORKDIR /app/server
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build

WORKDIR /app/client
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

WORKDIR /app/server
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=build /app/client/node_modules /app/client/node_modules
COPY --from=build /app/server/node_modules /app/server/node_modules
COPY --from=build /app/client/dist /app/client/dist
COPY --from=build /app/server/dist /app/server/dist
ENV SERVICE_NAME="SSE & WS DEMO"
ENV HTTP_PORT=80
ENV KEEP_ALIVE_HEARTBEAT=55000
ENV REDIS_URL=redis://redis-general:6379
ENV NEW_RELIC_APP_NAME=sse-ws-demo
ENV NEW_RELIC_LICENSE_KEY=XXXXXX
EXPOSE 80

WORKDIR /app/server

CMD [ "node", "-r", "newrelic", "dist/main" ]
