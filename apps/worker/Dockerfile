FROM node:20-alpine

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY packages/ ./packages/
COPY apps/worker/ ./apps/worker/

RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Generate Prisma Client BEFORE building
RUN pnpm --filter @skyzer/db generate

WORKDIR /app/apps/worker

RUN pnpm build

CMD ["pnpm", "start"]
