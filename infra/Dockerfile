FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ARG BACKEND_API_INTERNAL_PORT
ARG CLIENT_INTERNAL_PORT
ARG ENV_TYPE
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS dev-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build

FROM base AS common-dev
COPY --from=dev-deps /app/node_modules/ /app/node_modules

FROM base AS common-prod
COPY --from=prod-deps /app/node_modules/ /app/node_modules

FROM common-dev AS backend-dev
COPY --from=dev-deps /app/apps/backend/node_modules/ /app/apps/backend/node_modules
WORKDIR /app/apps/backend
EXPOSE $BACKEND_INTERNAL_PORT
CMD pnpm dev

FROM common-prod AS backend-prod
COPY --from=prod-deps /app/apps/backend/node_modules/ /app/apps/backend/node_modules
COPY --from=build /app/apps/backend/dist/ /app/apps/backend/dist
WORKDIR /app/apps/backend
EXPOSE $BACKEND_INTERNAL_PORT
CMD pnpm start:prod

FROM common-dev AS client-dev
COPY --from=dev-deps /app/apps/client/node_modules/ /app/apps/client/node_modules
WORKDIR /app/apps/client
EXPOSE $CLIENT_INTERNAL_PORT
CMD pnpm dev

FROM common-prod AS client-prod
COPY --from=prod-deps /app/apps/client/node_modules/ /app/apps/client/node_modules
COPY --from=build /app/apps/client/.next/ /app/apps/client/.next
WORKDIR /app/apps/client
EXPOSE $CLIENT_INTERNAL_PORT
CMD pnpm start