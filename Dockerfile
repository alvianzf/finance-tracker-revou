# =====================
# Build stage
# =====================
FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

# Generate Prisma client for type safety during build
RUN pnpm prisma generate

# Build NestJS
RUN pnpm run build


# =====================
# Runtime stage
# =====================
FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm

# Install prod dependencies only
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

# Copy built app
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma

# Generate Prisma client AGAIN (runtime-safe)
RUN pnpm prisma generate

EXPOSE 3000

CMD sh -c "pnpm prisma migrate deploy && pnpm prisma db seed && node dist/main.js"
