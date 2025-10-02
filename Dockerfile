ARG NODE_IMAGE=node:24-alpine
ARG BUILD_DIR=build  # endre via build-arg hvis output ikke er "build"

FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package*.json ./
RUN --mount=type=secret,id=NODE_AUTH_TOKEN sh -c '\
  npm config set //npm.pkg.github.com/:_authToken=$(cat /run/secrets/NODE_AUTH_TOKEN) && \
  npm config set @navikt:registry=https://npm.pkg.github.com && \
  npm ci \
'

FROM ${NODE_IMAGE} AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/${BUILD_DIR} ./build
RUN npm prune --omit=dev

EXPOSE 3000
CMD ["npm", "run", "start"]