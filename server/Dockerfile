FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json ./
RUN npm install -g pnpm && pnpm i --frozen-lockfile

# Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm && pnpm build

# Runner
FROM base AS runner
ENV NODE_ENV production

# Copy built files and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

# Copy service account credentials
COPY keys/service_account.json /app/keys/service_account.json

EXPOSE 4000
CMD ["node", "dist/index.js"]