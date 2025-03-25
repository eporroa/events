FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g npm@11.2.0
RUN corepack enable
RUN pnpm --version
RUN pnpm config set store-dir /pnpm/store
RUN pnpm config set cache-dir /pnpm/cache
RUN pnpm config set virtual-store-dir /pnpm/virtual-store

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --no-frozen-lockfile
RUN pnpm run -r build
RUN mkdir -p /app/events-backend /app/events-frontend
RUN pnpm deploy --filter=events-backend --prod /app/events-backend
RUN pnpm deploy --filter=events-frontend --prod /app/events-frontend

FROM base AS events-frontend
COPY --from=build /app/events-frontend /app
WORKDIR /app
EXPOSE 3000
CMD [ "pnpm", "start" ]

FROM base AS events-backend
COPY --from=build /app/events-backend /app
WORKDIR /app
EXPOSE 4000
CMD [ "pnpm", "start" ]