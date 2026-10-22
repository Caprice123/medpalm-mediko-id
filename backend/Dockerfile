# syntax=docker/dockerfile:1

# Node.js is pinned to an exact patch release on purpose. Coolify's default
# Nixpacks build pack can only select a MAJOR version (22, 24, ...) and takes
# whatever patch its nixpkgs snapshot happens to carry — which is how this app
# ended up on v22.11. v22.23.4 is the release that fixes CVE-2026-111497
# (Brotli out-of-bounds write / RCE) plus the TLS hostname and DNS flaws from
# the 2026-10-21 Node.js security release.
ARG NODE_VERSION=22.23.4


# ---------------------------------------------------------------------------
# deps — install node_modules and generate the Prisma client
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION}-slim AS deps

# openssl + ca-certificates: required by the Prisma query engine.
# python3/make/g++: only used when a native module (bcrypt) has no prebuilt
# binary for this Node ABI. They stay in this stage, out of the final image.
RUN apt-get update && apt-get install -y --no-install-recommends \
      openssl \
      ca-certificates \
      python3 \
      make \
      g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Generate the Prisma client against this image's libc/openssl, so the engine
# binary matches the runtime stages below (same base image).
COPY prisma ./prisma
RUN npx prisma generate


# ---------------------------------------------------------------------------
# base — everything the API and the workers share. No CMD: the stages below
# differ only in which process they start.
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION}-slim AS base

RUN apt-get update && apt-get install -y --no-install-recommends \
      openssl \
      ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# multer writes temp uploads into ./uploads/temp relative to cwd
RUN mkdir -p uploads/temp && chown -R node:node /app

USER node


# ---------------------------------------------------------------------------
# worker — BullMQ background worker. Build this stage by setting Coolify's
# "Docker build stage target" to: worker
#
# worker.js runs ONE queue per process, taken from argv[2]. WORKER_QUEUE picks
# which one, so a single image covers all three: set it per Coolify resource to
# summaryNotes (default), email, or challenge.
#
# `exec` matters: it makes node replace the shell as PID 1, so Coolify's
# SIGTERM reaches worker.js's graceful-shutdown handler instead of killing the
# shell and leaving jobs stalled.
# ---------------------------------------------------------------------------
FROM base AS worker

ENV WORKER_QUEUE=summaryNotes

CMD ["sh", "-c", "exec node worker.js \"$WORKER_QUEUE\""]


# ---------------------------------------------------------------------------
# api — the Express server. Kept LAST so an empty "Docker build stage target"
# in Coolify still builds the API, which is what the existing app resource is
# already configured for.
# ---------------------------------------------------------------------------
FROM base AS api

EXPOSE 5000

CMD ["node", "--import", "./instrument.js", "server.js"]
