FROM node:20-alpine AS builder

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

RUN npm install -g pnpm && pnpm install --frozen-lockfile

WORKDIR /app/apps/web

RUN pnpm build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/node_modules ./node_modules
COPY --from=builder /app/apps/web/package.json ./package.json

EXPOSE 3000

CMD ["pnpm", "start"]
