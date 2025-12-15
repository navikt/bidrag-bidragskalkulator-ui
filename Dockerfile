FROM node:24-alpine AS dependencies
WORKDIR /app
COPY package*.json ./

# Set up npm configuration once
RUN --mount=type=secret,id=NODE_AUTH_TOKEN sh -c \
  'npm config set //npm.pkg.github.com/:_authToken=$(cat /run/secrets/NODE_AUTH_TOKEN) && \
  npm config set @navikt:registry=https://npm.pkg.github.com && \
  npm ci'

FROM node:24-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/build ./build

# Fjern npm/npx for å unngå at sårbarheter i npm sine interne deps blir funnet i runtime-imaget
RUN rm -rf /usr/local/lib/node_modules/npm \
    /usr/local/bin/npm \
    /usr/local/bin/npx || true

ENV NODE_ENV=production
EXPOSE 3000

# Start direkte (ikke via "npm run start")
CMD ["node", "./build/server/index.js"]

