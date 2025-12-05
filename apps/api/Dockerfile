# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy monorepo files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./

# Copy packages and apps
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Generate Prisma Client BEFORE building
RUN pnpm --filter @skyzer/db generate

# Build
RUN pnpm --filter @skyzer/api build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json

EXPOSE 3001

CMD ["node", "dist/main.js"]
